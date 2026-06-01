import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginRequest {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'john.doe@example.com' })
  email!: string;

  @MinLength(6)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'SuperSecret123' })
  password!: string;
}
