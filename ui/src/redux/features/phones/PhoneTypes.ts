export interface Phone {
  _id: string;
  name: string;
  slug: string;
  description: string;
  brand: string;
  basePrice: number;
  thumbnail: string;

  images: string[];

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