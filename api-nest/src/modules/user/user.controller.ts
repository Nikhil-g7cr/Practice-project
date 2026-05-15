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

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);
      return { status: 'Success', code: HttpStatus.CREATED, data: user };
    } catch (error: any) {
      throw error;
    }
  }

  @Get()
  async findAll() {
    try {
      const users = await this.userService.findAll();
      return { status: 'Success', code: HttpStatus.OK, data: users };
    } catch (error: any) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.userService.findOne(id);
      return { status: 'Success', code: HttpStatus.OK, data: user };
    } catch (error: any) {
      throw error;
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() createUserDto: CreateUserDto) {
    try {
      const updatedUser = await this.userService.update(id, createUserDto);
      return { status: 'Success', code: HttpStatus.OK, data: updatedUser };
    } catch (error: any) {
      throw error.message;
    }
  }

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
