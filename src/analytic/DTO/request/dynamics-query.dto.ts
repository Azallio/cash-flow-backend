// dto/dynamics-query.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { AnalyticsPeriodDto } from './analytics-period.dto';

export enum Granularity {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

export class DynamicsQueryDto extends AnalyticsPeriodDto {
  @ApiPropertyOptional({
    description: 'Гранулярность бакетов временного ряда',
    enum: Granularity,
    default: Granularity.DAY,
  })
  @IsOptional()
  @IsEnum(Granularity)
  granularity: Granularity = Granularity.DAY;
}
