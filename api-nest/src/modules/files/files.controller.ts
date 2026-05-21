// upload.controller.ts

import {
  Controller,
  Post,
  Delete,
  Param,
  UploadedFile,
  UseInterceptors,
  Get,
  Res,
  Response,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';

import { UploadService } from './files.service';

@ApiTags('api/Upload')
@Controller('api/upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

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
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadFile(file);
  }


  @Get()
  async getAllFiles() {
    const files = await this.uploadService.getAllFiles();
    
    return {
      status: 'Success',
      count: files.length,
      data: files,
    };
  }


  @Get(':blobName')
  async getFile(
    @Param('blobName') blobName: string,
    @Response() res, 
  ){
    const { stream, contentType } =
      await this.uploadService.getFileStream(blobName);

    // Set the proper content type so the browser displays the image inline
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }

    // Pipe the stream to the response
    stream?.pipe(res);
  }

  @Delete(':fileName')
  async deleteFile(@Param('fileName') fileName: string) {
    return this.uploadService.deleteFile(fileName);
  }
}
