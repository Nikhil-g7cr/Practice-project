import { Module } from '@nestjs/common';
import { AdsService } from './ads.service';
import { AdsController } from './ads.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ad, AdSchema } from '../../database/mongoose/schemas/ads.schema';
import { AdsAbstractService } from './ads.abstract';

@Module({
  imports:[
    MongooseModule.forFeature([{name:Ad.name, schema:AdSchema}])
  ],
  controllers: [AdsController],
  providers: [{
    provide:AdsAbstractService,
    useClass:AdsService
  }]
})
export class AdsModule {}
