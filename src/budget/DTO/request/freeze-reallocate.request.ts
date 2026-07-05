import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class FreezeReallocateRequest {
  @ApiProperty({
    example: 1,
    description: 'Budget to freeze and take funds from',
  })
  @IsInt()
  fromBudgetId: number;

  @ApiProperty({ example: 2, description: 'Budget to receive the freed limit' })
  @IsInt()
  toBudgetId: number;

  constructor(fromBudgetId: number, toBudgetId: number) {
    this.fromBudgetId = fromBudgetId;
    this.toBudgetId = toBudgetId;
  }
}
