import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // 1. Import MongooseModule
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart, CartSchema } from '../../database/mongoose/schemas/cart.schema'; // 2. Import your Cart and CartSchema

@Module({
  imports: [
    // 3. Register the Cart model so CartService can inject it
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}