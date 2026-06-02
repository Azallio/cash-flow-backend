import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PagingQueryRequest {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'Number of items to return',
    default: 20,
    minimum: 1,
  })
  public take: number = 20;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'Number of items to skip',
    default: 0,
    minimum: 0,
  })
  public skip: number = 0;
}
