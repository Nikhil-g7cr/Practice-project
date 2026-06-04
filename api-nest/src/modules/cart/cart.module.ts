import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // 1. Import MongooseModule
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart, CartSchema } from '../../database/mongoose/schemas/cart.schema'; // 2. Import your Cart and CartSchema
import { LaptopSchema } from '../../database/mongoose/schemas/laptops.schema';
import { PhoneSchema } from '../../database/mongoose/schemas/phones.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
      { name: 'Phone', schema: PhoneSchema },
      { name: 'Laptop', schema: LaptopSchema },
    ]),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}