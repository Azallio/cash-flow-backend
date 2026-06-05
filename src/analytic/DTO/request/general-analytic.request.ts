import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { AnalyticPeriod } from '../../../common/enums/analytic-period.enum';

export class GeneralAnalyticRequest {
  @ApiPropertyOptional({
    description:
      'Analytics period type. If omitted, analytics is returned for all time',
    enum: AnalyticPeriod,
    example: AnalyticPeriod.MONTH,
  })
  @IsOptional()
  @IsEnum(AnalyticPeriod)
  period?: AnalyticPeriod;

  constructor(period?: AnalyticPeriod) {
    this.period = period;
  }
}
