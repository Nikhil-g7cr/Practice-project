import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PhoneDocument = Phone & Document;

@Schema({ timestamps: true })
export class Phone {

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  brand: string;

  @Prop({ default: 'smartphone' })
  category: string;

  @Prop({ required: true })
  basePrice: number;

  @Prop({ default: 0 })
  discountPrice: number;

  @Prop({ required: true })
  thumbnail: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({
    type: [
      {
        name: String,
        hexCode: String,
      },
    ],
    default: [],
  })
  colors: {
    name: string;
    hexCode: string;
  }[];

  @Prop({
    type: [
      {
        storage: String,
        price: Number,
        stock: Number,
      },
    ],
    default: [],
  })
  storageVariants: {
    storage: string;
    price: number;
    stock: number;
  }[];

  @Prop({
    type: {
      processor: String,
      display: String,
      battery: String,
      camera: String,
      ram: String,
      os: String,
    },
  })
  specifications: {
    processor: string;
    display: string;
    battery: string;
    camera: string;
    ram: string;
    os: string;
  };

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  reviewsCount: number;

  @Prop({ default: true })
  isAvailable: boolean;

  @Prop({ default: false })
  isFeatured: boolean;
}

export const PhoneSchema = SchemaFactory.createForClass(Phone);