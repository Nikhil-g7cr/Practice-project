export interface Phone {
  _id: string;
  name: string;
  slug: string;
  description: string;
  brand: string;
  basePrice: number;
  thumbnail: string;

  images: string[];

  storageVariants: {
    storage: string;
    price: number;
    stock: number;
  }[];

  colors: {
    name: string;
    hexCode: string;
  }[];

  specifications?: {
    processor: string;
    display: string;
    battery: string;
    camera: string;
    ram: string;
    os: string;
  };

  rating: number;
  reviewsCount: number;

  isAvailable: boolean;
  isFeatured: boolean;
}

export interface PhoneState {
  phones: Phone[];

  loading: boolean;

  error: string | null;
}