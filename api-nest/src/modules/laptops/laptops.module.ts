import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LaptopsService } from './laptops.service';
import { LaptopsController } from './laptops.controller';
import { FilesAzureService } from '../files/files.service';
import { User, UserSchema } from '../../database/mongoose/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [LaptopsController],
  providers: [LaptopsService, FilesAzureService],
})
export class LaptopsModule {}
