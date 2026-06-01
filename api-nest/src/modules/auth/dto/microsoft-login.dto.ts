import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MicrosoftLoginDto {
  @IsString()
  @IsNotEmpty()
  idToken: string;

  @IsString()
  @IsOptional()
  accessToken?: string;
}
