import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Response,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../core/guards/auth/auth.guard';
import { RolesGuard } from '../../core/guards/auth/roles.gaurd';
import { Roles } from '../../core/decorators/roles.decorator';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User signup' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @Post('signup')
  signUp(@Body() signupDto: SignUpDto) {
    return this.authService.signup(signupDto);
  }

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @Post('login')
  async signin(
    @Body() loginDto: LoginDto,
    @Headers('user-agent') userAgent: string,
    @Request() req,
    @Response({ passthrough: true }) res,
  ) {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const result = await this.authService.login(loginDto, userAgent, ipAddress);

    // Set HttpOnly cookie for refresh token
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: this.parseTimeToMs(result.refreshTokenExpiresIn),
      path: '/api/auth',
    });

    // Return access token and user data (without refresh token)
    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @Post('refresh')
  async refresh(@Request() req, @Response({ passthrough: true }) res) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new Error('Refresh token not found in cookies');
    }

    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const result = await this.authService.refreshAccessToken(
      refreshToken,
      userAgent,
      ipAddress,
    );

    // Update HttpOnly cookie with new refresh token
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: this.parseTimeToMs(result.refreshTokenExpiresIn),
      path: '/api/auth',
    });

    // Return new access token and user data
    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req, @Response({ passthrough: true }) res) {
    const token = req.headers.authorization?.split(' ')[1];
    const result = await this.authService.logout(token);

    // Clear refresh token cookie
    res.clearCookie('refreshToken', { path: '/api/auth' });

    return result;
  }

  @ApiOperation({ summary: 'Logout from all devices' })
  @ApiResponse({ status: 200, description: 'Logged out from all devices' })
  @UseGuards(JwtAuthGuard)
  @Post('logout-all')
  async logoutAll(@Request() req, @Response({ passthrough: true }) res) {
    const result = await this.authService.logoutAll(req.user.id);

    // Clear refresh token cookie
    res.clearCookie('refreshToken', { path: '/api/auth' });

    return result;
  }
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Request() req) {
    return req.user;
  }
  @ApiOperation({ summary: 'Admin only route' })
  @ApiResponse({ status: 200, description: 'Admin access granted' })
  

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin')
  adminRoute() {
    return 'AdminOnly';
  }

  private parseTimeToMs(timeStr: string): number {
    const match = timeStr.match(/^(\d+)([dhms])$/);
    if (!match) return 7 * 24 * 60 * 60 * 1000; // Default 7 days

    const [, amount, unit] = match;
    const num = parseInt(amount, 10);

    switch (unit) {
      case 'd':
        return num * 24 * 60 * 60 * 1000;
      case 'h':
        return num * 60 * 60 * 1000;
      case 'm':
        return num * 60 * 1000;
      case 's':
        return num * 1000;
      default:
        return 7 * 24 * 60 * 60 * 1000;
    }
  }
}
