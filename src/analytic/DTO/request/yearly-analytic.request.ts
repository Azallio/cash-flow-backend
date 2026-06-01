import { ApiProperty } from '@nestjs/swagger';

export class YearlyAnalyticRequest {
  @ApiProperty({
    description: 'Year for the analytic query',
    example: 2023,
  })
  year: number;

  constructor(year: number) {
    this.year = year;
  }
}
