import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../common/guards/auth/auth.guard';
import { RolesGuard } from '../common/guards/auth/roles.gaurd';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() signupDto:SignUpDto){
    return this.authService.signup(signupDto)
  }

  @Post('login')
  signin(@Body() loginDto:LoginDto){
    return this.authService.login(loginDto)
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Request() req){
    return req.user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin')
  adminRoute(){
    return 'AdminOnly'
  }


}
