import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';
import { SignUpDto } from './dto/signup.dto';
import { MicrosoftLoginDto } from './dto/microsoft-login.dto';
import bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import { SessionService } from '../../database/mongoose/dao/session.dao';

@Injectable()
export class AuthService {
  private microsoftJwks?: ReturnType<typeof createRemoteJWKSet>;

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private sessionService: SessionService,
  ) {}

  async signup(signupDto: SignUpDto) {
    try {
      const existingUser = await this.userService.findbyEmail(signupDto.email);

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const hashedPassword = await bcrypt.hash(signupDto.password, 10);

      const user = await this.userService.create({
        ...signupDto,
        password: hashedPassword,
      });

      return user;
    } catch (error: any) {
      throw new ConflictException(error.message);
    }
  }

  async login(loginDto: LoginDto, userAgent: string, ipAddress: string) {
    const { email, password } = loginDto;

    const user = await this.userService.findbyEmail(email);

    if (!user) {
      throw new UnauthorizedException('User Not Found');
    }

    if (!user.password) {
      throw new UnauthorizedException(
        'This account uses Microsoft sign-in. Please continue with Microsoft.',
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('invalid email or password');
    }

    return this.createAuthSession(user, userAgent, ipAddress);
  }

  async microsoftLogin(
    microsoftLoginDto: MicrosoftLoginDto,
    userAgent: string,
    ipAddress: string,
  ) {
    console.log('[Microsoft SSO] Login exchange started', {
      hasIdToken: !!microsoftLoginDto.idToken,
      hasGraphAccessToken: !!microsoftLoginDto.accessToken,
      ipAddress,
    });

    const microsoftProfile = await this.verifyMicrosoftIdToken(
      microsoftLoginDto.idToken,
    );

    console.log('[Microsoft SSO] ID token verified', {
      email: microsoftProfile.email,
      microsoftOid: microsoftProfile.microsoftOid,
      microsoftTenantId: microsoftProfile.microsoftTenantId,
    });

    const imageUrl = microsoftLoginDto.accessToken
      ? await this.fetchMicrosoftGraphProfilePhoto(
          microsoftLoginDto.accessToken,
        )
      : undefined;

    const user = await this.findOrCreateMicrosoftUser({
      ...microsoftProfile,
      imageUrl,
    });

    console.log('[Microsoft SSO] Local user resolved', {
      userId: user._id,
      email: user.email,
      authProvider: user.authProvider,
      hasProfileImage: !!user.image_url,
    });

    return this.createAuthSession(user, userAgent, ipAddress);
  }

  async refreshAccessToken(
    refreshToken: string,
    userAgent?: string,
    ipAddress?: string,
  ) {
    try {
      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token is missing');
      }

      // Validate refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret:
          this.configService.get('JWT_REFRESH_SECRET') ||
          this.configService.get('JWT_SECRET'),
      });

      // Check if session exists and is active
      const session =
        await this.sessionService.findActiveSessionByRefreshToken(refreshToken);
      if (!session) {
        throw new UnauthorizedException('Session expired or revoked');
      }

      // Get user info
      const user = await this.userService.findOne(payload.id);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Generate new access token
      const newAccessToken = this.jwtService.sign({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });

      // Generate new refresh token
      const newRefreshToken = this.jwtService.sign(
        {
          id: user._id,
          type: 'refresh',
        },
        {
          expiresIn: this.configService.get('JWT_REFRESH_EXPIRES') || '7d',
          secret:
            this.configService.get('JWT_REFRESH_SECRET') ||
            this.configService.get('JWT_SECRET'),
        },
      );

      const jwtExpires = this.configService.get('JWT_EXPIRES') || '3d';
      const expiresAt = this.calculateExpirationDate(jwtExpires);

      // Update session with new tokens
      await this.sessionService.refreshSession(
        refreshToken,
        newAccessToken,
        newRefreshToken,
        expiresAt,
      );

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        refreshTokenExpiresIn:
          this.configService.get('JWT_REFRESH_EXPIRES') || '7d',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          image_url: user.image_url,
        },
      };
    } catch (error: any) {
      console.error('🔴 Refresh Token Error:', {
        error: error.message,
        hasToken: !!refreshToken,
        tokenPreview: refreshToken
          ? refreshToken.substring(0, 20) + '...'
          : 'NONE',
      });
      throw new UnauthorizedException(error.message || 'Invalid refresh token');
    }
  }

  async logout(token: string) {
    await this.sessionService.revokeSession(token, 'User logout');
    return { message: 'Logged out successfully' };
  }

  async logoutAll(userId: string) {
    await this.sessionService.revokeAllUserSessions(
      userId,
      'All sessions revoked',
    );
    return { message: 'All sessions logged out' };
  }

  async getProfile(userId: string) {
    const user = await this.userService.findOne(userId);

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      image_url: user.image_url,
    };
  }

  private async createAuthSession(
    user: any,
    userAgent: string,
    ipAddress: string,
  ) {
    console.log('[Auth Session] Creating session', {
      userId: user._id,
      email: user.email,
      ipAddress,
    });

    const accessToken = this.jwtService.sign({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    const refreshToken = this.jwtService.sign(
      {
        id: user._id,
        type: 'refresh',
      },
      {
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES') || '7d',
        secret:
          this.configService.get('JWT_REFRESH_SECRET') ||
          this.configService.get('JWT_SECRET'),
      },
    );

    const jwtExpires = this.configService.get('JWT_EXPIRES') || '3d';
    const expiresAt = this.calculateExpirationDate(jwtExpires);

    await this.sessionService.createSession(
      user._id.toString(),
      accessToken,
      refreshToken,
      userAgent || 'unknown',
      ipAddress || 'unknown',
      expiresAt,
    );

    console.log('[Auth Session] Session created', {
      userId: user._id,
      accessTokenExpiresIn: this.configService.get('JWT_EXPIRES') || '3d',
      refreshTokenExpiresIn:
        this.configService.get('JWT_REFRESH_EXPIRES') || '7d',
    });

    return {
      accessToken,
      refreshToken,
      refreshTokenExpiresIn:
        this.configService.get('JWT_REFRESH_EXPIRES') || '7d',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image_url: user.image_url,
      },
    };
  }

  private async verifyMicrosoftIdToken(idToken: string) {
    const clientId =
      this.configService.get<string>('MICROSOFT_CLIENT_ID') ||
      this.configService.get<string>('AZURE_AD_CLIENT_ID');
    const configuredTenantId =
      this.configService.get<string>('MICROSOFT_TENANT_ID') ||
      this.configService.get<string>('AZURE_AD_TENANT_ID') ||
      'common';

    if (!clientId) {
      throw new BadRequestException(
        'Microsoft SSO is not configured. Missing MICROSOFT_CLIENT_ID.',
      );
    }

    try {
      const { payload } = await jwtVerify(idToken, this.getMicrosoftJwks(), {
        audience: clientId,
      });

      this.assertMicrosoftIssuer(payload, configuredTenantId);

      const microsoftOid = this.getRequiredClaim(payload, 'oid');
      const microsoftTenantId = this.getRequiredClaim(payload, 'tid');
      const email =
        this.getOptionalStringClaim(payload, 'email') ||
        this.getOptionalStringClaim(payload, 'preferred_username') ||
        this.getOptionalStringClaim(payload, 'upn');
      const tokenName =
        this.getOptionalStringClaim(payload, 'name') ||
        this.getOptionalStringClaim(payload, 'given_name');

      if (!email) {
        throw new UnauthorizedException(
          'Microsoft token did not include an email address.',
        );
      }

      return {
        name: tokenName || email,
        email: email.toLowerCase(),
        microsoftOid,
        microsoftTenantId,
      };
    } catch (error: any) {
      console.error('[Microsoft SSO] ID token verification failed', {
        error: error.message,
      });
      throw new UnauthorizedException('Invalid Microsoft sign-in token');
    }
  }

  private async findOrCreateMicrosoftUser(data: {
    name: string;
    email: string;
    microsoftOid: string;
    microsoftTenantId: string;
    imageUrl?: string;
  }) {
    const existingMicrosoftUser =
      await this.userService.findByMicrosoftIdentity(
        data.microsoftOid,
        data.microsoftTenantId,
      );

    if (existingMicrosoftUser) {
      console.log('[Microsoft SSO] Found user by Microsoft identity');
      return this.userService.linkMicrosoftIdentity(
        existingMicrosoftUser._id.toString(),
        data,
      );
    }

    const existingEmailUser = await this.userService.findbyEmail(data.email);

    if (existingEmailUser) {
      console.log('[Microsoft SSO] Linking Microsoft identity to email user');
      return this.userService.linkMicrosoftIdentity(
        existingEmailUser._id.toString(),
        data,
      );
    }

    console.log('[Microsoft SSO] Creating new Microsoft user');
    return this.userService.createMicrosoftUser(data);
  }

  private async fetchMicrosoftGraphProfilePhoto(accessToken: string) {
    try {
      const response = await fetch(
        'https://graph.microsoft.com/v1.0/me/photo/$value',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        console.log('[Microsoft SSO] Graph profile photo unavailable', {
          status: response.status,
        });
        return undefined;
      }

      const contentType = response.headers.get('content-type') || 'image/jpeg';
      const photoBuffer = Buffer.from(await response.arrayBuffer());

      console.log('[Microsoft SSO] Graph profile photo loaded', {
        bytes: photoBuffer.length,
        contentType,
      });

      return `data:${contentType};base64,${photoBuffer.toString('base64')}`;
    } catch (error: any) {
      console.error('[Microsoft SSO] Graph profile photo fetch failed', {
        error: error.message,
      });
      return undefined;
    }
  }

  private getMicrosoftJwks() {
    if (!this.microsoftJwks) {
      this.microsoftJwks = createRemoteJWKSet(
        new URL('https://login.microsoftonline.com/common/discovery/v2.0/keys'),
      );
    }

    return this.microsoftJwks;
  }

  private assertMicrosoftIssuer(
    payload: JWTPayload,
    configuredTenantId: string,
  ) {
    const tokenTenantId = this.getRequiredClaim(payload, 'tid');

    // Build expected issuer using token's tenant ID or configured tenant ID
    const issuerTenantId =
      configuredTenantId === 'common' ? tokenTenantId : configuredTenantId;
    const expectedIssuer = `https://login.microsoftonline.com/${issuerTenantId}/v2.0`;

    if (payload.iss !== expectedIssuer) {
      console.warn('[Microsoft SSO] Token issuer mismatch', {
        expected: expectedIssuer,
        actual: payload.iss,
      });
      throw new UnauthorizedException('Invalid Microsoft token issuer');
    }

    if (
      configuredTenantId !== 'common' &&
      configuredTenantId !== 'organizations' &&
      configuredTenantId !== tokenTenantId
    ) {
      throw new UnauthorizedException('Microsoft tenant is not allowed');
    }
  }

  private getRequiredClaim(payload: JWTPayload, claim: string) {
    const value = payload[claim];

    if (typeof value !== 'string' || !value.trim()) {
      throw new UnauthorizedException(
        `Missing Microsoft token claim: ${claim}`,
      );
    }

    return value;
  }

  private getOptionalStringClaim(payload: JWTPayload, claim: string) {
    const value = payload[claim];
    return typeof value === 'string' && value.trim() ? value : undefined;
  }

  private calculateExpirationDate(expiresIn: string): Date {
    const now = new Date();
    const match = expiresIn.match(/^(\d+)([dhms])$/);

    if (!match) {
      return new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // Default 3 days
    }

    const [, amount, unit] = match;
    const num = parseInt(amount, 10);

    switch (unit) {
      case 'd':
        return new Date(now.getTime() + num * 24 * 60 * 60 * 1000);
      case 'h':
        return new Date(now.getTime() + num * 60 * 60 * 1000);
      case 'm':
        return new Date(now.getTime() + num * 60 * 1000);
      case 's':
        return new Date(now.getTime() + num * 1000);
      default:
        return new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    }
  }
}
