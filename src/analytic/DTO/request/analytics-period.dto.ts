// dto/analytics-period.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class AnalyticsPeriodDto {
  @ApiPropertyOptional({
    description:
      'Начало периода (ISO 8601, включительно). Если не передан вместе с to — берётся текущий календарный месяц (UTC).',
    example: '2026-06-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({
    description:
      'Конец периода (ISO 8601, исключительно). Если не передан вместе с from — берётся текущий календарный месяц (UTC).',
    example: '2026-07-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  to?: string;
}
