import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class PagingQueryRequest {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @ApiProperty()
  public take!: number;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  @ApiProperty()
  public skip!: number;
}
