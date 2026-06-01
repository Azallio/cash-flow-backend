import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class YearlyAnalyticRequest {
  @Type(() => Number)
  @IsInt()
  @Min(2000)
  @Max(2100)
  @ApiProperty({
    description: 'Year for the analytic query',
    example: 2023,
  })
  year: number;

  constructor(year: number) {
    this.year = year;
  }
}
