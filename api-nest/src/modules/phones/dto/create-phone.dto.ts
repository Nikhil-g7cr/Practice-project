import { Type } from 'class-transformer';
import {
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreatePhoneDto {
  @IsString()
  @IsNotEmpty()
  model: string;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(5000000)
  price: number;

  @IsUrl({}, { message: 'The image link should be a url' })
  @IsNotEmpty()
  image: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(10)
  rating: number;

  @IsNotEmpty()
  @IsUrl({}, { message: 'The site link should be a url' })
  site: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  launchDate: Date;
}
