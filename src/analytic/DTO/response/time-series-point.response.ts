// dto/responses/time-series-point.response.ts
import { ApiProperty } from '@nestjs/swagger';

export class TimeSeriesPointResponse {
  @ApiProperty({
    example: '2026-06-15T00:00:00.000Z',
    description:
      'Начало бакета (день/неделя/месяц в зависимости от granularity), ISO 8601',
  })
  bucket: string;

  @ApiProperty({ example: '68540.00' })
  income: string;

  @ApiProperty({ example: '39210.00' })
  expense: string;

  constructor(bucket: string, income: string, expense: string) {
    this.bucket = bucket;
    this.income = income;
    this.expense = expense;
  }
}
