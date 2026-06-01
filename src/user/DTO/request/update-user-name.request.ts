import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class UpdateUserNameRequest {
  @IsEmail()
  @ApiProperty()
  email!: string;
}
