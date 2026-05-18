// upload.controller.ts

import {
  Controller,
  Post,
  Delete,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import {
  ApiTags,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

import { UploadService } from './files.service';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.uploadService.uploadFile(file);
  }

  @Delete(':fileName')
  async deleteFile(
    @Param('fileName') fileName: string,
  ) {
    return this.uploadService.deleteFile(
      fileName,
    );
  }
}