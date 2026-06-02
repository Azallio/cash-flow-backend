import { ApiProperty } from '@nestjs/swagger';

export class GeneralAnalyticResponse {
  @ApiProperty({ example: 12500 })
  totalIncome: number;

  @ApiProperty({ example: 4300 })
  totalExpense: number;

  @ApiProperty({ example: 8200 })
  netBalance: number;

  constructor(totalIncome: number, totalExpense: number) {
    this.totalIncome = totalIncome;
    this.totalExpense = totalExpense;
    this.netBalance = totalIncome - totalExpense;
  }
}
