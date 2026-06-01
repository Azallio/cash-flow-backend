import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class MonthlyAnalyticRequest {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  @ApiProperty({
    description: 'Month for the analytic query',
    example: 1,
  })
  month: number;

  @Type(() => Number)
  @IsInt()
  @Min(2000)
  @Max(2100)
  @ApiProperty({
    description: 'Year for the analytic query',
    example: 2023,
  })
  year: number;

  constructor(month: number, year: number) {
    this.month = month;
    this.year = year;
  }
}
