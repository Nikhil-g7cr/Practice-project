import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePhoneDto } from './dto/create-phone.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import {
  Phone,
  PhoneDocument,
} from '../../database/mongoose/schemas/phones.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UploadService } from '../files/files.service';

@Injectable()
export class PhonesService {
  constructor(
    @InjectModel(Phone.name)
    private phoneModel: Model<PhoneDocument>,
    private uploadService: UploadService // Inject the upload service
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

  // async findAll() {
  //   // 1. Get all phones from MongoDB
  //   const phones = await this.phoneModel.find().lean().exec();

  //   // 2. Loop through them and replace the filename with a fresh SAS URL
  //   const phonesWithUrls = await Promise.all(
  //     phones.map(async (phone) => {
  //       let signedUrl = phone.thumbnail; // default to what's in DB
        
  //       // If the thumbnail is just a filename (not an old http link), generate a SAS URL
  //       if (phone.thumbnail && !phone.thumbnail.startsWith('http')) {
  //          signedUrl = await this.uploadService.getSasUrl(phone.thumbnail);
  //       }

  //       return {
  //         ...phone,
  //         thumbnail: signedUrl, // The frontend now receives a ready-to-use, fresh 1-hour URL!
  //       };
  //     })
  //   );

  //   return phonesWithUrls;
  // }

  // async findAll(page: number = 1, limit: number = 10) {
  //   // Calculate how many documents to skip
  //   const skip = (page - 1) * limit;

  //   // Run both queries in parallel for better performance
  //   const [data, totalItems] = await Promise.all([
  //     this.phoneModel.find().skip(skip).limit(limit).exec(),
  //     this.phoneModel.countDocuments().exec()
  //   ]);

  //   // Calculate total pages
  //   const totalPages = Math.ceil(totalItems / limit);

  //   return {
  //     data,
  //     meta: {
  //       totalItems,
  //       itemsPerPage: limit,
  //       currentPage: page,
  //       totalPages,
  //     }
  //   };
  // }

  async findAll(page: number = 1, limit: number = 10) {
    // Calculate how many documents to skip
    const skip = (page - 1) * limit;

    // Run both queries in parallel for better performance
    const [data, totalItems] = await Promise.all([
      // ADDED .lean() HERE so 'phone' is a standard object, not a heavy Mongoose document
      this.phoneModel.find().skip(skip).limit(limit).lean().exec(), 
      this.phoneModel.countDocuments().exec()
    ]);

    // Calculate total pages
    const totalPages = Math.ceil(totalItems / limit);

    const phonesWithUrls = await Promise.all(
      data.map(async (phone) => {
        let signedUrl = phone.thumbnail; // default to what's in DB
        
        // If the thumbnail is just a filename (not an old http link), generate a SAS URL
        if (phone.thumbnail && !phone.thumbnail.startsWith('http')) {
           signedUrl = await this.uploadService.getSasUrl(phone.thumbnail);
        }

        return {
          ...phone,
          thumbnail: signedUrl, // The frontend now receives a ready-to-use, fresh 1-hour URL!
        };
      })
    );

    return {
      data: phonesWithUrls, // FIX: Return the newly mapped array with the URLs!
      meta: {
        totalItems,
        itemsPerPage: limit,
        currentPage: page,
        totalPages,
      }
    };
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

  async updatePhone(id: string, updatePhoneDto: UpdatePhoneDto) {
    try {
      const updatedPhone = await this.phoneModel.findByIdAndUpdate(
        id,
        updatePhoneDto,
        {
          new: true,
          runValidators: true,
        },
      );

      if (!updatedPhone) {
        throw new NotFoundException('Phone not found');
      }

      return updatedPhone;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictException('Slug already exists');
      }

      throw error;
    }
  }

  async remove(id: string) {
    const existing = await this.phoneModel.findById(id);
    if (!existing) {
      throw new NotFoundException(`Unable to find the data with id:-${id}`);
    }
    return this.phoneModel.findByIdAndDelete(id);
  }
}
