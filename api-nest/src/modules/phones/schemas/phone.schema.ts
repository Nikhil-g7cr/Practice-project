import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PhoneDocument = Phone & Document;

@Schema()
export class Phone {

  @Prop({
    required: true,
    unique: true,
    trim:true
  })
  model: string;

  @Prop({ required: true })
  brand: string;

  @Prop()
  image: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  site: string;

  @Prop({ required: true })
  rating: number;

  @Prop()
  launchDate: Date;
}

export const phoneSchema = SchemaFactory.createForClass(Phone);
