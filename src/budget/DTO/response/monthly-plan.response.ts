import { ApiProperty } from '@nestjs/swagger';

export class MonthlyPlanResponse {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: '2026-07-01', format: 'date' })
  month!: Date;

  @ApiProperty({ example: '80000.00' })
  projectedIncome!: string;

  @ApiProperty({
    example: '55000.00',
    description: 'SUM of active MONTHLY budget limits for the month',
  })
  totalAllocated!: string;

  @ApiProperty({
    example: '25000.00',
    description: 'projectedIncome - totalAllocated',
  })
  available!: string;
}
