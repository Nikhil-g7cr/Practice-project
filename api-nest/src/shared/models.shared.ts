export interface IUser {
  _id?: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAuth {
  _id?: string;
  userId: string;
  token: string;
  refreshToken?: string;
  expiresAt: Date;
  createdAt?: Date;
}

export interface IPhone {
  _id?: string;
  userId: string;
  phoneNumber: string;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IApiResponse<T = any> {
  statusCode: number;
  message: string;
  data?: T;
  timestamp?: string;
  path?: string;
}
