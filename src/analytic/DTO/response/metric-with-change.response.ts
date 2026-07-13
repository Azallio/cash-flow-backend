// dto/responses/metric-with-change.response.ts
import { ApiProperty } from '@nestjs/swagger';

export class MetricWithChangeResponse {
  @ApiProperty({
    example: '142580.00',
    description: 'Значение за текущий период',
  })
  current: string;

  @ApiProperty({
    example: '126850.00',
    description: 'Значение за предыдущий период такой же длины',
  })
  previous: string;

  @ApiProperty({
    example: 12.4,
    nullable: true,
    description:
      'Процент изменения (current относительно previous). null, если previous = 0 — процент не определён.',
  })
  changePercent: number | null;

  constructor(current: string, previous: string, changePercent: number | null) {
    this.current = current;
    this.previous = previous;
    this.changePercent = changePercent;
  }
}
