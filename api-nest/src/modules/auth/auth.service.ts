import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignUpDto } from './dto/signup.dto';
import bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../modules/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(signupDto: SignUpDto) {
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
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userService.findbyEmail(email);

    if (!user) throw new UnauthorizedException('invalid credentials');

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      throw new UnauthorizedException('invalid email or password');

    const token = await this.jwtService.sign(
      { id: user.id },
      {
        secret: this.configService.get('JWT_SECRET'),
      },
    );

    return { accessToken: token };
  }
}
