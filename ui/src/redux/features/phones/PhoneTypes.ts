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

export interface PaginationMeta {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
}

export interface PhoneState {
  phones: Phone[];
  meta: PaginationMeta | null;
  loading: boolean;
  error: string | null;
}

export interface PhonesResponse {
  status: string;
  code: number;
  data: Phone[];
  meta: PaginationMeta;
}

export interface PhoneResponse {
  status: string;
  code: number;
  data: Phone;
}
