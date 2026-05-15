import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePhoneDto } from './dto/create-phone.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { Phone, PhoneDocument } from './schemas/phone.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PhonesService {
  constructor(
    @InjectModel(Phone.name)
    private phoneModel: Model<PhoneDocument>,
  ) {}

  create(createPhoneDto: CreatePhoneDto) {
    try {
      const newPhone = new this.phoneModel(createPhoneDto);
      return newPhone.save();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictException('Phone is already exists');
      }
      throw new InternalServerErrorException('Failed to create Phone');
    }
  }

  findAll() {
    return this.phoneModel.find();
  }

  findOne(id: string) {
    return this.phoneModel.findById(id);
  }

  async update(id: string, updatePhoneDto: UpdatePhoneDto) {
    const existingId = await this.phoneModel.findById(id);

    if (!existingId) {
      throw new NotFoundException(`Unable to find the data with id:-${id}`);
    }

    const newData = await this.phoneModel.findByIdAndUpdate(
      id,
      updatePhoneDto,
      { returnDocument: 'after' },
    );
    return newData;
  }

  async remove(id: string) {
    const existing = await this.phoneModel.findById(id);
    if (!existing) {
      throw new NotFoundException(`Unable to find the data with id:-${id}`);
    }
    return this.phoneModel.findByIdAndDelete(id);
  }
}
