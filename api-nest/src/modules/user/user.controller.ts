import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../core/guards/auth/auth.guard';
import { RolesGuard } from '../../core/guards/auth/roles.gaurd';
import { Roles } from '../../core/decorators/roles.decorator';
import bcrypt from 'bcrypt';

@ApiTags('Users')
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(
      await this.hashPasswordIfPresent(createUserDto),
    );

    return { status: 'Success', code: HttpStatus.CREATED, data: user };
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @Get()
  async findAll() {
    const users = await this.userService.findAll();

    return { status: 'Success', code: HttpStatus.OK, data: users };
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);

    return { status: 'Success', code: HttpStatus.OK, data: user };
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userService.update(
      id,
      await this.hashPasswordIfPresent(updateUserDto),
    );

    return { status: 'Success', code: HttpStatus.OK, data: updatedUser };
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const removedUser = await this.userService.remove(id);

    return { status: 'Success', code: HttpStatus.OK, data: removedUser };
  }

  private async hashPasswordIfPresent<T extends { password?: string }>(
    userDto: T,
  ): Promise<T> {
    if (!userDto.password) {
      return userDto;
    }

    return {
      ...userDto,
      password: await bcrypt.hash(userDto.password, 10),
    };
  }
}
