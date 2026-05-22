// api-nest/src/modules/laptops/laptops.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LaptopsService } from './laptops.service';
import { LaptopsController } from './laptops.controller';
import { Laptop, LaptopSchema } from '../../database/mongoose/schemas/laptops.schema'; // Adjust path to where you saved your schema

@Module({
  imports: [
    // Register the Mongoose Model
    MongooseModule.forFeature([{ name: Laptop.name, schema: LaptopSchema }])
  ],
  controllers: [LaptopsController],
  providers: [LaptopsService],
  exports: [LaptopsService], // Optional: if other modules need to query laptops
})
export class LaptopsModule {}