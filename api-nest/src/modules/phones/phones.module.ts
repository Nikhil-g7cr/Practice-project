import { Module } from '@nestjs/common';
import { PhonesService } from './phones.service';
import { PhonesController } from './phones.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { phoneSchema } from './schemas/phone.schema';
import { UploadService } from '../files/files.service';
import { UploadModule } from '../files/upload.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Phone', schema: phoneSchema }]),
    UploadModule
  ],
  controllers: [PhonesController],
  providers: [PhonesService],
})
export class PhonesModule {}
