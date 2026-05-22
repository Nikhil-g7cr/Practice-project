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
  HttpStatus,
  Query,
  UseGuards,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { LaptopsService } from './laptops.service';
import { CreateLaptopDto } from './dto/create-laptop.dto';
import { UpdateLaptopDto } from './dto/update-laptop.dto';
import { JwtAuthGuard } from '../../core/guards/auth/auth.guard';
import { RolesGuard } from '../../core/guards/auth/roles.gaurd';
import { Roles } from '../../core/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Laptops')
@Controller('/api/laptops')
export class LaptopsController {
  constructor(private readonly laptopsService: LaptopsService) {}

  @ApiOperation({ summary: 'Create a new laptop' })
  @ApiResponse({ status: 201, description: 'Laptop created successfully' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  async create(@Body(new ValidationPipe()) createLaptopDto: CreateLaptopDto) {
    try {
      const laptop = await this.laptopsService.create(createLaptopDto);
      return { status: 'Success', code: HttpStatus.CREATED, data: laptop };
    } catch (error: unknown) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create laptop');
    }
  }

  @ApiOperation({ summary: 'Get all laptops with pagination' })
  @ApiResponse({ status: 200, description: 'Laptops retrieved successfully' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    try {
      const pageNumber = parseInt(page, 10) || 1;
      const limitNumber = parseInt(limit, 10) || 10;

      const result = await this.laptopsService.findAll(pageNumber, limitNumber);

      return {
        status: 'Success',
        code: HttpStatus.OK,
        data: result.data,
        meta: result.meta,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch laptops');
    }
  }

  @ApiOperation({ summary: 'Get laptop by ID' })
  @ApiResponse({ status: 200, description: 'Laptop found' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const laptop = await this.laptopsService.findOne(id);
      return { status: 'Success', code: HttpStatus.OK, data: laptop };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch the laptop');
    }
  }

  @ApiOperation({ summary: 'Update laptop' })
  @ApiResponse({ status: 200, description: 'Laptop updated successfully' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateLaptopDto: UpdateLaptopDto,
  ) {
    try {
      const updatedLaptop = await this.laptopsService.update(id, updateLaptopDto);
      return {
        status: 'Success',
        code: HttpStatus.OK,
        data: updatedLaptop,
      };
    } catch (error: any) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update laptop');
    }
  }

  @ApiOperation({ summary: 'Delete laptop' })
  @ApiResponse({ status: 200, description: 'Laptop deleted successfully' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const deletedLaptop = await this.laptopsService.remove(id);
      return {
        status: 'Success',
        code: HttpStatus.OK,
        data: deletedLaptop,
      };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete laptop');
    }
  }
}