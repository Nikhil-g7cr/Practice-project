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

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('invalid email or password');
    }

    // Generate Access Token (short-lived)
    const accessToken = this.jwtService.sign({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    // Generate Refresh Token (long-lived)
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

    // Calculate expiration time
    const jwtExpires = this.configService.get('JWT_EXPIRES') || '3d';
    const expiresAt = this.calculateExpirationDate(jwtExpires);

    // Create session in database
    const session = await this.sessionService.createSession(
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
      },
    };
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
