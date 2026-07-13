// dto/category-breakdown-query.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Max } from 'class-validator';
import { AnalyticsPeriodDto } from './analytics-period.dto';

export class CategoryBreakdownQueryDto extends AnalyticsPeriodDto {
  @ApiPropertyOptional({
    description:
      'Максимальное число категорий в ответе (топ по сумме, по убыванию). Если не передан — возвращаются все категории.',
    minimum: 1,
    maximum: 50,
    example: 6,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @Max(50)
  limit?: number;
}
