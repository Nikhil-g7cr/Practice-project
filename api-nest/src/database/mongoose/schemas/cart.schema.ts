import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class CartItem {
  @Prop({ type: Types.ObjectId, required: true, refPath: 'items.productModel' })
  productId: Types.ObjectId;

  @Prop({ required: true, enum: ['Phone', 'Laptop'] })
  productModel: string; // Tells Mongoose which collection to look in

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true })
  originalPrice: number;

  @Prop({ required: true })
  discountPrice: number;
}

@Schema({ timestamps: true })
export class Cart extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ type: [CartItem], default: [] })
  items: CartItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);