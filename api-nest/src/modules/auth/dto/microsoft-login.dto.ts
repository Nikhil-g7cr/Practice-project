import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MicrosoftLoginDto {
  @IsString()
  @IsNotEmpty()
  idToken: string;

  @IsOptional()
  @IsString()
  accessToken?: string;
}
