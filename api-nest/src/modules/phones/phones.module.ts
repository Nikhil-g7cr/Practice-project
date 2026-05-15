import { Module } from '@nestjs/common';
import { PhonesService } from './phones.service';
import { PhonesController } from './phones.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { phoneSchema } from './schemas/phone.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Phone', schema: phoneSchema }]),
  ],
  controllers: [PhonesController],
  providers: [PhonesService],
})
export class PhonesModule {}
