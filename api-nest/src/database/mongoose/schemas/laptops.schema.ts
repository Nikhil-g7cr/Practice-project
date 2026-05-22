import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LaptopDocument = Laptop & Document;

@Schema({ timestamps: true })
export class Laptop {

  @Prop({ required: true, unique: true })
  sku: string;

  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  modelName: string;

  @Prop()
  series: string;

  @Prop()
  description: string;

  @Prop([String])
  images: string[];

  @Prop()
  thumbnail: string;

  @Prop({
    type: {
      processorBrand: String,
      processorModel: String,
      generation: String,
      cores: Number,
      threads: Number,
      baseClock: String,
      boostClock: String,
    },
  })
  cpu: {
    processorBrand: string;
    processorModel: string;
    generation: string;
    cores: number;
    threads: number;
    baseClock: string;
    boostClock: string;
  };

  @Prop({
    type: {
      gpuBrand: String,
      gpuModel: String,
      vram: String,
      type: String,
    },
  })
  gpu: {
    gpuBrand: string;
    gpuModel: string;
    vram: string;
    type: string;
  };

  @Prop({
    type: {
      ramSize: Number,
      ramType: String,
      ramSpeed: String,
      expandable: Boolean,
      maxRamSupported: Number,
    },
  })
  memory: {
    ramSize: number;
    ramType: string;
    ramSpeed: string;
    expandable: boolean;
    maxRamSupported: number;
  };

  @Prop({
    type: {
      storageType: String,
      storageCapacity: String,
      secondaryStorage: String,
    },
  })
  storage: {
    storageType: string;
    storageCapacity: string;
    secondaryStorage: string;
  };

  @Prop({
    type: {
      size: String,
      resolution: String,
      refreshRate: String,
      panelType: String,
      brightness: String,
      touchScreen: Boolean,
    },
  })
  display: {
    size: string;
    resolution: string;
    refreshRate: string;
    panelType: string;
    brightness: string;
    touchScreen: boolean;
  };

  @Prop({
    type: {
      batteryCapacity: String,
      batteryLife: String,
      fastCharging: Boolean,
      chargerWatts: String,
    },
  })
  battery: {
    batteryCapacity: string;
    batteryLife: string;
    fastCharging: boolean;
    chargerWatts: string;
  };

  @Prop({
    type: {
      wifi: String,
      bluetooth: String,
      ethernet: Boolean,
    },
  })
  connectivity: {
    wifi: string;
    bluetooth: string;
    ethernet: boolean;
  };

  @Prop([String])
  ports: string[];

  @Prop()
  webcam: string;

  @Prop()
  keyboardType: string;

  @Prop()
  operatingSystem: string;

  @Prop()
  weight: string;

  @Prop()
  color: string;

  @Prop()
  warranty: string;

  @Prop()
  stock: number;

  @Prop()
  price: number;

  @Prop()
  discountPrice: number;

  @Prop()
  currency: string;

  @Prop()
  rating: number;

  @Prop()
  totalReviews: number;

  @Prop([String])
  tags: string[];

  @Prop({
    enum: [
      'Gaming',
      'Business',
      'Student',
      'Creator',
      'Ultrabook',
      'Workstation',
      'Professional'
    ],
  })
  category: string;

  @Prop({ default: true })
  isAvailable: boolean;
}

export const LaptopSchema = SchemaFactory.createForClass(Laptop);