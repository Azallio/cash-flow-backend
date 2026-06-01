import { ApiProperty } from '@nestjs/swagger';

export class GeneralAnalyticRequest {
  @ApiProperty({
    description: 'Start date for the analytic query',
    example: '2023-01-01T00:00:00.000Z',
  })
  startDate: Date;

  @ApiProperty({
    description: 'End date for the analytic query',
    example: '2023-12-31T23:59:59.999Z',
  })
  endDate: Date;

  constructor(startDate: Date, endDate: Date) {
    this.startDate = startDate;
    this.endDate = endDate;
  }
}
