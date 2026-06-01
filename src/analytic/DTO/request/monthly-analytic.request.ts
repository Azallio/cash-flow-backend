import { ApiProperty } from '@nestjs/swagger';

export class MonthlyAnalyticRequest {
  @ApiProperty({
    description: 'Month for the analytic query',
    example: 1,
  })
  month: number;

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
