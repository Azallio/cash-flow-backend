import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserNameRequest {
  @IsString()
  @ApiProperty()
  name!: string;
}
