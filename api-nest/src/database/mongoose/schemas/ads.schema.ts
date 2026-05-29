import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AdDocument = Ad & Document;

@Schema({
  timestamps: true,
})
export class Ad {
  @Prop({
    required: true,
    trim: true,
  })
  title: string;

  @Prop({
    trim: true,
  })
  subtitle?: string;

  @Prop({
    trim: true,
  })
  description?: string;

  @Prop({
    required: true,
  })
  imageUrl: string;

  @Prop()
  mobileImageUrl?: string;

  @Prop({
    required: true,
  })
  redirectUrl: string;

  @Prop({
    enum: ['hero', 'featured', 'sale', 'brand', 'product'],
    default: 'hero',
  })
  type: string;

  @Prop({
    enum: [
      'homepage-hero',
      'homepage-middle',
      'homepage-bottom',
      'category-page',
      'product-page',
    ],
    default: 'homepage-hero',
  })
  position: string;

  @Prop({
    enum: ['smartphone', 'laptop', 'all'],
    default: 'all',
  })
  targetCategory: string;

  @Prop()
  targetBrand?: string;

  @Prop({
    default: 'Shop Now',
  })
  ctaText: string;

  @Prop({
    default: 1,
  })
  priority: number;

  @Prop({
    default: true,
  })
  isActive: boolean;

  @Prop({
    default: Date.now,
  })
  startDate: Date;

  @Prop()
  endDate?: Date;

  @Prop({
    default: 0,
  })
  impressions: number;

  @Prop({
    default: 0,
  })
  clicks: number;
}

export const AdSchema = SchemaFactory.createForClass(Ad);