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
  Query,
} from '@nestjs/common';
import { PhonesService } from './phones.service';
import { CreatePhoneDto } from './dto/create-phone.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { JwtAuthGuard } from '../../core/guards/auth/auth.guard';
import { RolesGuard } from '../../core/guards/auth/roles.gaurd';
import { Roles } from '../../core/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Phones')
@Controller('/api/phones')
export class PhonesController {
  constructor(private readonly phonesService: PhonesService) {}

  @ApiOperation({ summary: 'Create a new phone' })
  @ApiResponse({ status: 201, description: 'Phone created successfully' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  async create(@Body(new ValidationPipe()) createPhoneDto: CreatePhoneDto) {
    try {
      const phone = await this.phonesService.create(createPhoneDto);
      return { status: 'Success', code: HttpStatus.CREATED, data: phone };
    } catch (error: unknown) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new ConflictException(
        error instanceof Error ? error.message : 'Failed to create phone',
      );
    }
  }

  @ApiOperation({ summary: 'Get all phones with pagination' })
  @ApiResponse({ status: 200, description: 'Phones retrieved successfully' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10)',
  })
  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    try {
      // Convert query string parameters to numbers
      const pageNumber = parseInt(page, 10) || 1;
      const limitNumber = parseInt(limit, 10) || 10;

      const result = await this.phonesService.findAll(pageNumber, limitNumber);

      return {
        status: 'Success',
        code: HttpStatus.OK,
        data: result.data,
        meta: result.meta, // Include pagination metadata in the response
      };
    } catch {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  @ApiOperation({ summary: 'Get phone by ID' })
  @ApiResponse({ status: 200, description: 'Phone found' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.phonesService.findOne(id);
    } catch {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  @ApiOperation({ summary: 'Update phone' })
  @ApiResponse({ status: 200, description: 'Phone updated successfully' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const phone = await this.phonesService.remove(id);
      return {
        status: 'Success',
        code: HttpStatus.OK,
        data: phone,
      };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete phone');
    }
  }
}
