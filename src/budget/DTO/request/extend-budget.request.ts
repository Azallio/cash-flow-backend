import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Matches } from 'class-validator';
import { AdjustmentSource } from '../../../common/enums/adjustment-source.enum';

export class ExtendBudgetRequest {
  @ApiProperty({ example: 1, description: 'ID of the budget to extend' })
  @IsInt()
  targetBudgetId: number;

  @ApiProperty({
    example: '500.00',
    description: 'Amount to add (decimal string)',
  })
  @IsString()
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: 'amount must be a positive decimal with up to 2 places',
  })
  amount: string;

  @ApiProperty({ enum: AdjustmentSource })
  @IsEnum(AdjustmentSource)
  source: AdjustmentSource;

  @ApiPropertyOptional({
    example: 2,
    description: 'Required when source = BUDGET_REALLOCATION',
  })
  @IsInt()
  @IsOptional()
  sourceBudgetId?: number;

  @ApiPropertyOptional({ example: 'Extra income from freelance' })
  @IsString()
  @IsOptional()
  reason?: string;

  constructor(
    targetBudgetId: number,
    amount: string,
    source: AdjustmentSource,
    sourceBudgetId?: number,
    reason?: string,
  ) {
    this.targetBudgetId = targetBudgetId;
    this.amount = amount;
    this.source = source;
    this.sourceBudgetId = sourceBudgetId;
    this.reason = reason;
  }
}
