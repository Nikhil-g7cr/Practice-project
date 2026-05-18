import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignUpDto {

  @ApiProperty({
    example:'jhone doe',
    description:'name of the user',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example:'jhone.doe@example.com',
    description:'email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example:'password123',
    description:'password of the user',
  })
  @MinLength(6)
  password: string;
}
