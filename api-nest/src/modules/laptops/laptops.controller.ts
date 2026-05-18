import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { LaptopsService } from './laptops.service';
import { CreateLaptopDto } from './dto/create-laptop.dto';
import { UpdateLaptopDto } from './dto/update-laptop.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesAzureService } from '../files/files.service';

@Controller('laptops')
export class LaptopsController {
  constructor(
    private readonly laptopsService: LaptopsService,
    private readonly fileService:FilesAzureService
  ) {}

  // @Post()
  // @UseInterceptors(FileInterceptor('image'))
  // async create(
  //   @Body('id') id: string,
  //   // @UploadedFile() file: Express.Multer.File,
  // ){
  //   const containerName = 'fileUpload';

  //   // const upload = await this.fileService.uploadfile(file, containerName);
  //   await this.laptopsService.saveUrl(id, upload);
  //   return { upload, message: 'upload successfully' };
  // }
  
}
