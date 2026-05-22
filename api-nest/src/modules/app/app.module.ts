import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import dotenv from 'dotenv';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { PhonesModule } from '../phones/phones.module';
import { AppController } from './app.controller';
import { UploadModule } from '../files/upload.module';
import { LaptopsModule } from '../laptops/laptops.module';

dotenv.config();
const mongodb = process.env.MONGODB_URI;

@Module({
  imports: [
    PhonesModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(`${mongodb}`),
    UserModule,
    AuthModule,
    LaptopsModule,
    UploadModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
