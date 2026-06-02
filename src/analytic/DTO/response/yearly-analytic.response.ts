import { ApiProperty } from '@nestjs/swagger';
import { TransactionEntity } from '../../../DAL/entities/transaction.entity';
import { TransactionResponse } from '../../../transaction/DTO/response/transaction.response';

export class YearlyAnalyticResponse {
  @ApiProperty({ example: 2026 })
  year: number;

  @ApiProperty({ example: 142000 })
  totalIncome: number;

  @ApiProperty({ example: 53000 })
  totalExpense: number;

  @ApiProperty({ example: 89000 })
  netBalance: number;

  @ApiProperty({
    type: TransactionResponse,
    isArray: true,
  })
  transactions: TransactionEntity[];

  constructor(
    year: number,
    totalIncome: number,
    totalExpense: number,
    transactions: TransactionEntity[],
  ) {
    this.year = year;
    this.totalIncome = totalIncome;
    this.totalExpense = totalExpense;
    this.transactions = transactions;
    this.netBalance = totalIncome - totalExpense;
  }
}
