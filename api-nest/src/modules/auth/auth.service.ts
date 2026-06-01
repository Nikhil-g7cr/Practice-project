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
    const microsoftTokenUser = await this.verifyMicrosoftIdToken(
      microsoftLoginDto.idToken,
    );
    const microsoftGraphUser = await this.fetchMicrosoftGraphProfile(
      microsoftLoginDto.accessToken,
    );

    const microsoftUser = {
      ...microsoftTokenUser,
      name: microsoftGraphUser?.name || microsoftTokenUser.name,
      email: microsoftGraphUser?.email || microsoftTokenUser.email,
      imageUrl: microsoftGraphUser?.imageUrl,
    };

    let user = await this.userService.findByMicrosoftIdentity(
      microsoftUser.oid,
      microsoftUser.tid,
    );

    if (!user) {
      const userWithSameEmail = await this.userService.findbyEmail(
        microsoftUser.email,
      );

      user = userWithSameEmail
        ? await this.userService.linkMicrosoftIdentity(
            userWithSameEmail._id.toString(),
            {
              name: microsoftUser.name,
              microsoftOid: microsoftUser.oid,
              microsoftTenantId: microsoftUser.tid,
              imageUrl: microsoftUser.imageUrl,
            },
          )
        : await this.userService.createMicrosoftUser({
            name: microsoftUser.name,
            email: microsoftUser.email,
            microsoftOid: microsoftUser.oid,
            microsoftTenantId: microsoftUser.tid,
            imageUrl: microsoftUser.imageUrl,
          });
    } else if (microsoftUser.imageUrl && user.image_url !== microsoftUser.imageUrl) {
      user = await this.userService.linkMicrosoftIdentity(user._id.toString(), {
        name: microsoftUser.name,
        microsoftOid: microsoftUser.oid,
        microsoftTenantId: microsoftUser.tid,
        imageUrl: microsoftUser.imageUrl,
      });
    }

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
      const session = await this.sessionService.findActiveSessionByRefreshToken(
        refreshToken,
      );
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
        tokenPreview: refreshToken ? refreshToken.substring(0, 20) + '...' : 'NONE',
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

  private async createAuthSession(user: any, userAgent: string, ipAddress: string) {
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
      userAgent,
      ipAddress,
      expiresAt,
    );

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

  private async fetchMicrosoftGraphProfile(accessToken?: string) {
    if (!accessToken) {
      return null;
    }

    try {
      const profileResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!profileResponse.ok) {
        return null;
      }

      const profile = await profileResponse.json();
      const imageUrl = await this.fetchMicrosoftProfilePhoto(accessToken);

      return {
        name: profile.displayName as string | undefined,
        email: (profile.mail || profile.userPrincipalName) as
          | string
          | undefined,
        imageUrl,
      };
    } catch {
      return null;
    }
  }

  private async fetchMicrosoftProfilePhoto(accessToken: string) {
    try {
      const photoResponse = await fetch(
        'https://graph.microsoft.com/v1.0/me/photo/$value',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!photoResponse.ok) {
        return undefined;
      }

      const contentType =
        photoResponse.headers.get('content-type') || 'image/jpeg';
      const buffer = Buffer.from(await photoResponse.arrayBuffer());

      return `data:${contentType};base64,${buffer.toString('base64')}`;
    } catch {
      return undefined;
    }
  }

  private async verifyMicrosoftIdToken(idToken: string) {
    const clientId = this.getMicrosoftClientId();
    const tenantId = this.getMicrosoftTenantId();
    const issuer = `https://login.microsoftonline.com/${tenantId}/v2.0`;

    if (!this.microsoftJwks) {
      this.microsoftJwks = createRemoteJWKSet(
        new URL(
          `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`,
        ),
      );
    }

    const { payload } = await jwtVerify(idToken, this.microsoftJwks, {
      audience: clientId,
      issuer,
    });

    const email = this.getMicrosoftEmail(payload);
    const oid = this.requiredClaim(payload, 'oid');
    const tid = this.requiredClaim(payload, 'tid');
    const name = this.getMicrosoftName(payload, email);

    return {
      email,
      oid,
      tid,
      name,
    };
  }

  private getMicrosoftClientId() {
    const clientId =
      this.configService.get<string>('MICROSOFT_CLIENT_ID') ||
      process.env.MICROSOFT_CLIENT_ID;

    if (!clientId) {
      throw new BadRequestException('MICROSOFT_CLIENT_ID is not configured');
    }

    return clientId;
  }

  private getMicrosoftTenantId() {
    const tenantId =
      this.configService.get<string>('MICROSOFT_TENANT_ID') ||
      process.env.MICROSOFT_TENANT_ID;

    if (!tenantId) {
      throw new BadRequestException('MICROSOFT_TENANT_ID is not configured');
    }

    return tenantId;
  }

  private getMicrosoftEmail(payload: JWTPayload) {
    const email =
      this.stringClaim(payload, 'preferred_username') ||
      this.stringClaim(payload, 'email') ||
      this.stringClaim(payload, 'upn');

    if (!email) {
      throw new UnauthorizedException(
        'Microsoft account did not provide an email address',
      );
    }

    return email.toLowerCase();
  }

  private getMicrosoftName(payload: JWTPayload, email: string) {
    return this.stringClaim(payload, 'name') || email.split('@')[0];
  }

  private requiredClaim(payload: JWTPayload, claim: string) {
    const value = this.stringClaim(payload, claim);

    if (!value) {
      throw new UnauthorizedException(`Microsoft token is missing ${claim}`);
    }

    return value;
  }

  private stringClaim(payload: JWTPayload, claim: string) {
    const value = payload[claim];

    return typeof value === 'string' ? value : undefined;
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
