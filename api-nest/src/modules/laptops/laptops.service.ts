import { Injectable } from '@nestjs/common';
import { CreateLaptopDto } from './dto/create-laptop.dto';
import { UpdateLaptopDto } from './dto/update-laptop.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import { User } from '../../database/mongoose/schemas/user.schema';
import { FilesAzureService } from '../files/files.service';

@Injectable()
export class LaptopsService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User & Document>,
    private readonly fileService: FilesAzureService,
  ) {}

  async saveUrl(id: string, file_url: string) {
    await this.userModel.findByIdAndUpdate(id, { image_url: file_url }).exec();
  }
}
