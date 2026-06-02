import { ApiProperty } from '@nestjs/swagger';
import { TransactionEntity } from '../../../DAL/entities/transaction.entity';
import { TransactionResponse } from '../../../transaction/DTO/response/transaction.response';

export class MonthlyAnalyticResponse {
  @ApiProperty({ example: 6 })
  month: number;

  @ApiProperty({ example: 12500 })
  totalIncome: number;

  @ApiProperty({ example: 4300 })
  totalExpense: number;

  @ApiProperty({ example: 8200 })
  netBalance: number;

  @ApiProperty({
    type: TransactionResponse,
    isArray: true,
  })
  transactions: TransactionEntity[];

  @ApiProperty({ example: 2026 })
  year: number;

  constructor(
    month: number,
    year: number,
    totalIncome: number,
    totalExpense: number,
    transactions: TransactionEntity[],
  ) {
    this.month = month;
    this.year = year;
    this.totalIncome = totalIncome;
    this.totalExpense = totalExpense;
    this.netBalance = totalIncome - totalExpense;
    this.transactions = transactions;
  }
}
