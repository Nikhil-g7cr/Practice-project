import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  HttpException,
  ConflictException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { PhonesService } from './phones.service';
import { CreatePhoneDto } from './dto/create-phone.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { JwtAuthGuard } from '../../core/guards/auth/auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Phones')
@Controller('/api/phones')
export class PhonesController {
  constructor(private readonly phonesService: PhonesService) {}

  @ApiOperation({ summary: 'Create a new phone' })
  @ApiResponse({ status: 201, description: 'Phone created successfully' })
  @Post()
  async create(@Body(new ValidationPipe()) createPhoneDto: CreatePhoneDto) {
    try {
      const phone = await this.phonesService.create(createPhoneDto);
      return { status: 'Success', code: HttpStatus.CREATED, data: phone };
    } catch (error: any) {
      if (error instanceof ConflictException) {
        throw error.message;
      }
      throw new ConflictException(error.message);
    }
  }

  @ApiOperation({ summary: 'Get all phones' })
  @ApiResponse({ status: 200, description: 'Phones retrieved successfully' })
  @Get()
  async findAll() {
    try {
      const data = await this.phonesService.findAll();

      return { status: 'Success', code: HttpStatus.OK, data: data };
    } catch (error) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  @ApiOperation({ summary: 'Get phone by ID' })
  @ApiResponse({ status: 200, description: 'Phone found' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.phonesService.findOne(id);
    } catch (error) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  @ApiOperation({ summary: 'Update phone' })
  @ApiResponse({ status: 200, description: 'Phone updated successfully' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updatePhoneDto: UpdatePhoneDto,
  ) {
    try {
      const newPhone = await this.phonesService.update(id, updatePhoneDto);
      return {
        status: 'Success',
        code: HttpStatus.OK,
        data: newPhone,
      };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update phone');
    }
  }
  @ApiOperation({ summary: 'Delete phone' })
  @ApiResponse({ status: 200, description: 'Phone deleted successfully' })
  

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const phone= await this.phonesService.remove(id);
      return {
        status:"Success",
        code:HttpStatus.OK,
        data:phone
      }
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete phone');
    }
  }
}
