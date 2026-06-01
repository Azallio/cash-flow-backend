import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';
import { GeneralAnalyticRequest } from './general-analytic.request';

export class AnalyticByCategoryRequest extends GeneralAnalyticRequest {
  @Type(() => Number)
  @IsInt()
  @ApiProperty({
    description: 'ID of the category to analyze',
    example: 1,
  })
  categoryId: number;

  constructor(startDate: Date, endDate: Date, categoryId: number) {
    super(startDate, endDate);
    this.categoryId = categoryId;
  }
}
