import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt } from 'class-validator';

export class AnalyticByCategoryRequest {
  @ApiProperty({
    description: 'Start date for the analytic query',
    example: '2023-01-01T00:00:00.000Z',
  })
  @IsDateString()
  startDate: Date;

  @ApiProperty({
    description: 'End date for the analytic query',
    example: '2023-12-31T23:59:59.999Z',
  })
  @IsDateString()
  endDate: Date;

  @Type(() => Number)
  @IsInt()
  @ApiProperty({
    description: 'ID of the category to analyze',
    example: 1,
  })
  categoryId: number;

  constructor(startDate: Date, endDate: Date, categoryId: number) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.categoryId = categoryId;
  }
}
