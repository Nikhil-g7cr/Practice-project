import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Response,
  UseGuards,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { MicrosoftLoginDto } from './dto/microsoft-login.dto';

import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { JwtAuthGuard } from '../../core/guards/auth/auth.guard';
import { RolesGuard } from '../../core/guards/auth/roles.gaurd';
import { Roles } from '../../core/decorators/roles.decorator';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ================= SIGNUP =================

  @ApiOperation({ summary: 'User signup' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @Post('signup')
  signUp(@Body() signupDto: SignUpDto) {
    return this.authService.signup(signupDto);
  }

  // ================= LOGIN =================

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

    // Refresh Token Cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,

      // FALSE for localhost
      // TRUE only in production HTTPS
      secure: process.env.NODE_ENV === 'production',

      // Best for localhost + frontend/backend different ports
      sameSite: 'lax',

      // 7 days
      maxAge: this.parseTimeToMs(result.refreshTokenExpiresIn),

      // Important
      path: '/',
    });

    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  // ================= MICROSOFT SSO =================

  @ApiOperation({ summary: 'Microsoft SSO login' })
  @ApiResponse({ status: 200, description: 'Microsoft login successful' })
  @Post('microsoft')
  async microsoftLogin(
    @Body() microsoftLoginDto: MicrosoftLoginDto,
    @Headers('user-agent') userAgent: string,
    @Request() req,
    @Response({ passthrough: true }) res,
  ) {
    const ipAddress = req.ip || req.connection.remoteAddress;

    console.log('[Microsoft SSO] Controller received login request', {
      userAgent,
      ipAddress,
    });

    const result = await this.authService.microsoftLogin(
      microsoftLoginDto,
      userAgent,
      ipAddress,
    );

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: this.parseTimeToMs(result.refreshTokenExpiresIn),
      path: '/',
    });

    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }


  // ================= REFRESH TOKEN =================

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
  })
  @Post('refresh')
  async refresh(@Request() req, @Response({ passthrough: true }) res) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found in cookies');
    }

    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const result = await this.authService.refreshAccessToken(
      refreshToken,
      userAgent,
      ipAddress,
    );

    // Update refresh token cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: this.parseTimeToMs(result.refreshTokenExpiresIn),
      path: '/',
    });

    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  // ================= LOGOUT =================

  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req, @Response({ passthrough: true }) res) {
    const token = req.headers.authorization?.split(' ')[1];

    await this.authService.logout(token);

    // Clear cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return {
      message: 'Logged out successfully',
    };
  }

  // ================= LOGOUT ALL =================

  @ApiOperation({ summary: 'Logout from all devices' })
  @ApiResponse({
    status: 200,
    description: 'Logged out from all devices',
  })
  @UseGuards(JwtAuthGuard)
  @Post('logout-all')
  async logoutAll(@Request() req, @Response({ passthrough: true }) res) {
    await this.authService.logoutAll(req.user.id);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return {
      message: 'All sessions logged out',
    };
  }

  // ==================Clean the old cookies==================
  // @Get('clear-old-cookie')
  // clearOldCookie(@Response({ passthrough: true }) res) {
  //   res.clearCookie('refreshToken', {
  //     path: '/api/auth',
  //   });

  //   return {
  //     message: 'Old cookie cleared',
  //   };
  // }
  // ================= PROFILE =================

  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved',
  })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }

  // ================= ADMIN =================

  @ApiOperation({ summary: 'Admin only route' })
  @ApiResponse({
    status: 200,
    description: 'Admin access granted',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin')
  adminRoute() {
    return 'AdminOnly';
  }

  // ================= HELPER =================

  private parseTimeToMs(timeStr: string): number {
    const match = timeStr.match(/^(\d+)([dhms])$/);

    if (!match) {
      return 7 * 24 * 60 * 60 * 1000;
    }

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
