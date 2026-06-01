import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterRequest {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'john.doe@example.com' })
  email!: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  @ApiProperty({ example: 'strongPassword123' })
  password!: string;
}
