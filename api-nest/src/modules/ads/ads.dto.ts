import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateAdDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUrl()
  imageUrl: string;

  @IsOptional()
  @IsUrl()
  mobileImageUrl?: string;

  @IsString()
  redirectUrl: string;

  @IsOptional()
  @IsEnum(['hero', 'featured', 'sale', 'brand', 'product'])
  type?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsString()
  targetCategory?: string;

  @IsOptional()
  @IsString()
  targetBrand?: string;

  @IsOptional()
  @IsString()
  ctaText?: string;

  @IsOptional()
  @IsNumber()
  priority?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
