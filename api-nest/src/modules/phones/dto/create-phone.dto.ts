import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsHexColor,
  Min,
} from 'class-validator';

import { Type } from 'class-transformer';

// ================= COLORS DTO =================

class ColorDto {
  @IsString()
  name: string;

  @IsHexColor()
  hexCode: string;
}

// ================= STORAGE VARIANT DTO =================

class StorageVariantDto {
  @IsString()
  storage: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;
}

// ================= SPECIFICATIONS DTO =================

class SpecificationsDto {
  @IsString()
  processor: string;

  @IsString()
  display: string;

  @IsString()
  battery: string;

  @IsString()
  camera: string;

  @IsString()
  ram: string;

  @IsString()
  os: string;
}

// ================= CREATE PRODUCT DTO =================

export class CreatePhoneDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsString()
  description: string;

  @IsString()
  brand: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsNumber()
  @Min(0)
  basePrice: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discountPrice?: number;

  @IsString()
  thumbnail: string;

  @IsArray()
  @IsString({ each: true })
  images: string[];

  // ================= COLORS =================

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ColorDto)
  colors: ColorDto[];

  // ================= STORAGE VARIANTS =================

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StorageVariantDto)
  storageVariants: StorageVariantDto[];

  // ================= SPECIFICATIONS =================

  @ValidateNested()
  @Type(() => SpecificationsDto)
  specifications: SpecificationsDto;

  // ================= OPTIONAL FIELDS =================

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsNumber()
  reviewsCount?: number;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}