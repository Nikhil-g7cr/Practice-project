// upload.module.ts

import { Module } from '@nestjs/common';

import { UploadController } from './files.controller';
import { UploadService } from './files.service';

@Module({
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}