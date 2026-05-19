import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);
      return { status: 'Success', code: HttpStatus.CREATED, data: user };
    } catch (error: any) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @Get()
  async findAll() {
    try {
      const users = await this.userService.findAll();
      return { status: 'Success', code: HttpStatus.OK, data: users };
    } catch (error: any) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.userService.findOne(id);
      return { status: 'Success', code: HttpStatus.OK, data: user };
    } catch (error: any) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() createUserDto: CreateUserDto) {
    try {
      const updatedUser = await this.userService.update(id, createUserDto);
      return { status: 'Success', code: HttpStatus.OK, data: updatedUser };
    } catch (error: any) {
      throw error.message;
    }
  }
  
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const removedUser = await this.userService.remove(id);
      return { status: 'Success', code: HttpStatus.OK, data: removedUser };
    } catch (error: any) {
      throw error;
    }
  }
}
