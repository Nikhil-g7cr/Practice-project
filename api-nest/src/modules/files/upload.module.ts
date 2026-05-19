// upload.module.ts

import { Module } from '@nestjs/common';

import { UploadController } from './files.controller';
import { UploadService } from './files.service';
import { ConfigModule } from '../../config/config.module';

@Module({
  imports:[ConfigModule],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}