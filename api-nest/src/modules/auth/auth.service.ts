import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignUpDto } from './dto/signup.dto';
import bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import { SessionService } from '../../database/mongoose/dao/session.dao';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private sessionService: SessionService,
  ) {}

  // async signup(signupDto: SignUpDto) {
  //   try {
  //     const existingUser = await this.userService.findbyEmail(signupDto.email);

  //     if (existingUser) {
  //       throw new ConflictException('Email already exists');
  //     }

  //     const hashedPassword = await bcrypt.hash(signupDto.password, 10);

  //     const user = await this.userService.create({
  //       ...signupDto,
  //       password: hashedPassword,
  //     });

  //     return user;
  //   } catch (error: any) {
  //     throw new ConflictException(error.message);
  //   }
  // }

  async signup(dto: SignUpDto) {
  const user = await this.userService.create(dto);

  const payload = {
    email: user?.email,
  };

  return {
    accessToken: this.jwtService.sign(payload),
    user,
  };
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

  // ================= MICROSOFT LOGIN =================
  async microsoftLogin(
    accessToken: string,
    userAgent: string,
    ipAddress: string,
  ) {
    try {
      if (!accessToken) {
        throw new UnauthorizedException('Microsoft access token is required');
      }

      // 1. Get detailed profile information using $select to grab exactly what we need
      const graphResponse = await fetch(
        'https://graph.microsoft.com/v1.0/me?$select=id,displayName,givenName,surname,mail,userPrincipalName,jobTitle,mobilePhone',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!graphResponse.ok) {
        throw new UnauthorizedException('Invalid Microsoft token');
      }

      const msUser = await graphResponse.json();

      // Microsoft safely maps email to either 'mail' or 'userPrincipalName'
      const email = msUser.mail || msUser.userPrincipalName;
      const name = msUser.displayName;
      const tokenClaims = this.decodeJwtPayload(accessToken);
      const microsoftOid = msUser.id || tokenClaims?.oid || tokenClaims?.sub;
      const microsoftTenantId = tokenClaims?.tid || 'common';

      if (!email) {
        throw new BadRequestException('Email not provided by Microsoft');
      }

      if (!microsoftOid) {
        throw new UnauthorizedException('Microsoft user id not provided');
      }

      // 2. Make a SECOND request to grab the user's Microsoft Profile Picture
      let imageUrl = '';
      try {
        const photoResponse = await fetch(
          'https://graph.microsoft.com/v1.0/me/photo/$value',
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );

        // If they have a picture, convert it to a base64 string so you can save/display it
        if (photoResponse.ok) {
          const buffer = await photoResponse.arrayBuffer();
          const base64 = Buffer.from(buffer).toString('base64');
          imageUrl = `data:image/jpeg;base64,${base64}`;
        }
      } catch (e) {
        console.log('[Microsoft SSO] User has no profile picture configured');
      }

      // 3. Find, link, or create the user in your database
      let user = await this.userService.findByMicrosoftIdentity(
        microsoftOid,
        microsoftTenantId,
      );

      if (!user) {
        const existingUser = await this.userService.findbyEmail(email);

        if (existingUser) {
          user = await this.userService.linkMicrosoftIdentity(
            existingUser._id.toString(),
            {
              name,
              microsoftOid,
              microsoftTenantId,
              imageUrl,
            },
          );
        } else {
          user = await this.userService.createMicrosoftUser({
            email,
            name,
            microsoftOid,
            microsoftTenantId,
            imageUrl,
          });
        }
      }

      // 4. Create standard app session
      return this.createAuthSession(user, userAgent, ipAddress);
    } catch (error: any) {
      console.error('[Microsoft SSO Error]:', error);
      throw new UnauthorizedException(error.message || 'Microsoft login failed');
    }
  }

  // ================= TOKEN REFRESH =================

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
          phone: user.phone,
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
      phone: user.phone,
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
      phone: user.phone,
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
        phone: user.phone,
      },
    };
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

  private decodeJwtPayload(token: string): any | null {
    try {
      const payload = token.split('.')[1];
      if (!payload) {
        return null;
      }

      return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    } catch {
      return null;
    }
  }
}
