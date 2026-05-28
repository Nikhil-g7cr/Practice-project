// upload.controller.ts

import {
  Controller,
  Post,
  Delete,
  Param,
  UploadedFile,
  UseInterceptors,
  Get,
  Response as NestResponse,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';

import { FileInterceptor } from '@nestjs/platform-express';

import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';

import { UploadService } from './files.service';
import { JwtAuthGuard } from '../../core/guards/auth/auth.guard';
import { RolesGuard } from '../../core/guards/auth/roles.gaurd';
import { Roles } from '../../core/decorators/roles.decorator';

@ApiTags('api/Upload')
@Controller('api/upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
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

  @UseGuards(JwtAuthGuard) // Only allow authenticated users to generate a token
  @Get('/:fileName')
  async getFileSasToken(@Param('fileName') fileName: string) {
    const url = await this.uploadService.getSasUrl(fileName);
    return {
      status: 'Success',
      fileName,
      url,
    };
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
    @NestResponse() res: Response,
  ) {
    const { stream, contentType } =
      await this.uploadService.getFileStream(blobName);

    // Set the proper content type so the browser displays the image inline
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }

    // Pipe the stream to the response
    stream?.pipe(res);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':fileName')
  async deleteFile(@Param('fileName') fileName: string) {
    return this.uploadService.deleteFile(fileName);
  }
}
