export interface Laptop {
  _id: string;
  sku: string;
  brand: string;
  modelName: string;
  series?: string;
  description?: string;
  images: string[];
  thumbnail?: string;
  cpu?: {
    processorBrand: string;
    processorModel: string;
    generation: string;
    cores: number;
    threads: number;
    baseClock: string;
    boostClock: string;
  };
  gpu?: {
    gpuBrand: string;
    gpuModel: string;
    vram: string;
    type: string;
  };
  memory?: {
    ramSize: number;
    ramType: string;
    ramSpeed: string;
    expandable: boolean;
    maxRamSupported: number;
  };
  storage?: {
    storageType: string;
    storageCapacity: string;
    secondaryStorage?: string;
  };
  display?: {
    size: string;
    resolution: string;
    refreshRate: string;
    panelType: string;
    brightness: string;
    touchScreen: boolean;
  };
  battery?: {
    batteryCapacity: string;
    batteryLife: string;
    fastCharging: boolean;
    chargerWatts: string;
  };
  connectivity?: {
    wifi: string;
    bluetooth: string;
    ethernet: boolean;
  };
  ports: string[];
  webcam: string;
  keyboardType: string;
  operatingSystem: string;
  weight: string;
  color: string;
  warranty: string;
  stock: number;
  price: number;
  discountPrice: number;
  currency: string;
  rating: number;
  totalReviews: number;
  tags: string[];
  category: string;
  isAvailable: boolean;
}

export interface PaginationMeta {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
}

export interface LaptopState {
  laptops: Laptop[];
  meta: PaginationMeta | null;
  loading: boolean;
  error: string | null;
}

export interface LaptopsResponse {
  status: string;
  code: number;
  data: Laptop[];
  meta: PaginationMeta;
}

export interface LaptopResponse {
  status: string;
  code: number;
  data: Laptop;
}
