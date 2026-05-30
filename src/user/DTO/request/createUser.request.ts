import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserRequest {
  @IsString()
  @ApiProperty()
  name!: string;
}
