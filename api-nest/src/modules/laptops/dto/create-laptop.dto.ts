// create-laptop.dto.ts

import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsUrl,
  Min,
  Max,
  IsInt,
} from 'class-validator';

import { Type } from 'class-transformer';

class CpuDto {
  @IsString()
  processorBrand: string;

  @IsString()
  processorModel: string;

  @IsString()
  generation: string;

  @IsInt()
  cores: number;

  @IsInt()
  threads: number;

  @IsString()
  baseClock: string;

  @IsString()
  boostClock: string;
}

class GpuDto {
  @IsString()
  gpuBrand: string;

  @IsString()
  gpuModel: string;

  @IsString()
  vram: string;

  @IsString()
  type: string;
}

class MemoryDto {
  @IsInt()
  ramSize: number;

  @IsString()
  ramType: string;

  @IsString()
  ramSpeed: string;

  @IsBoolean()
  expandable: boolean;

  @IsInt()
  maxRamSupported: number;
}

class StorageDto {
  @IsString()
  storageType: string;

  @IsString()
  storageCapacity: string;

  @IsOptional()
  @IsString()
  secondaryStorage?: string;
}

class DisplayDto {
  @IsString()
  size: string;

  @IsString()
  resolution: string;

  @IsString()
  refreshRate: string;

  @IsString()
  panelType: string;

  @IsString()
  brightness: string;

  @IsBoolean()
  touchScreen: boolean;
}

class BatteryDto {
  @IsString()
  batteryCapacity: string;

  @IsString()
  batteryLife: string;

  @IsBoolean()
  fastCharging: boolean;

  @IsString()
  chargerWatts: string;
}

class ConnectivityDto {
  @IsString()
  wifi: string;

  @IsString()
  bluetooth: string;

  @IsBoolean()
  ethernet: boolean;
}

export class CreateLaptopDto {

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  modelName: string;

  @IsOptional()
  @IsString()
  series?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @IsUrl({}, { each: true })
  images: string[];

  @IsOptional()
  @IsUrl()
  thumbnail?: string;

  @ValidateNested()
  @Type(() => CpuDto)
  cpu: CpuDto;

  @ValidateNested()
  @Type(() => GpuDto)
  gpu: GpuDto;

  @ValidateNested()
  @Type(() => MemoryDto)
  memory: MemoryDto;

  @ValidateNested()
  @Type(() => StorageDto)
  storage: StorageDto;

  @ValidateNested()
  @Type(() => DisplayDto)
  display: DisplayDto;

  @ValidateNested()
  @Type(() => BatteryDto)
  battery: BatteryDto;

  @ValidateNested()
  @Type(() => ConnectivityDto)
  connectivity: ConnectivityDto;

  @IsArray()
  @IsString({ each: true })
  ports: string[];

  @IsString()
  webcam: string;

  @IsString()
  keyboardType: string;

  @IsString()
  operatingSystem: string;

  @IsString()
  weight: string;

  @IsString()
  color: string;

  @IsString()
  warranty: string;

  @IsInt()
  @Min(0)
  stock: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  discountPrice: number;

  @IsString()
  currency: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @IsInt()
  @Min(0)
  totalReviews: number;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsEnum([
    'Gaming',
    'Business',
    'Student',
    'Creator',
    'Ultrabook',
    'Workstation',
    'Professional'
  ])
  category: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}