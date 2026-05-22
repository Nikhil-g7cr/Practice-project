import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLaptopDto } from './dto/create-laptop.dto';
import { UpdateLaptopDto } from './dto/update-laptop.dto';
import { Laptop, LaptopDocument } from '../../database/mongoose/schemas/laptops.schema';

@Injectable()
export class LaptopsService {
  constructor(
    @InjectModel(Laptop.name)
    private laptopModel: Model<LaptopDocument>,
  ) {}

  async create(createLaptopDto: CreateLaptopDto) {
    try {
      const newLaptop = new this.laptopModel(createLaptopDto);
      return await newLaptop.save();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictException('Laptop with this SKU already exists');
      }
      throw new InternalServerErrorException('Failed to create Laptop');
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;

      const [data, totalItems] = await Promise.all([
        this.laptopModel.find().skip(skip).limit(limit).exec(),
        this.laptopModel.countDocuments().exec()
      ]);

      const totalPages = Math.ceil(totalItems / limit);

      return {
        data,
        meta: {
          totalItems,
          itemsPerPage: limit,
          currentPage: page,
          totalPages,
        }
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve laptops');
    }
  }

  async findOne(id: string) {
    try {
      const laptop = await this.laptopModel.findById(id);
      if (!laptop) {
        throw new NotFoundException(`Unable to find the laptop with id: ${id}`);
      }
      return laptop;
    } catch (error: any) {
      // If it's already a NotFoundException, just re-throw it
      if (error instanceof NotFoundException) {
        throw error;
      }
      // Otherwise, it's likely a CastError (invalid MongoDB ID format) or DB connection issue
      throw new InternalServerErrorException('Failed to retrieve the laptop');
    }
  }

  async update(id: string, updateLaptopDto: UpdateLaptopDto) {
    try {
      const updatedData = await this.laptopModel.findByIdAndUpdate(
        id,
        updateLaptopDto,
        { new: true, runValidators: true },
      );

      if (!updatedData) {
        throw new NotFoundException(`Unable to find the laptop with id: ${id}`);
      }
      return updatedData;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictException('SKU must be unique. This SKU already exists.');
      }
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update the laptop');
    }
  }

  async remove(id: string) {
    try {
      const existing = await this.laptopModel.findByIdAndDelete(id);
      if (!existing) {
        throw new NotFoundException(`Unable to find the laptop with id: ${id}`);
      }
      return existing;
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete the laptop');
    }
  }
}