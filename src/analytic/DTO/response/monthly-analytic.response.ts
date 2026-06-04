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
    example: -15.75,
    description:
      'Percentage change of current month net balance compared to previous month net balance',
  })
  profitPercent: number;

  @ApiProperty({
    example: 25.5,
    description:
      'Percentage change of current month total income compared to previous month total income',
  })
  totalIncomePercent: number;

  @ApiProperty({
    example: -10.25,
    description:
      'Percentage change of current month total expense compared to previous month total expense',
  })
  totalExpensePercent: number;

  @ApiProperty({
    example: -15.75,
    description:
      'Percentage change of current month net balance compared to previous month net balance',
  })
  netBalancePercent: number;

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
    totalIncomePercent: number,
    totalExpensePercent: number,
    netBalancePercent: number,
    transactions: TransactionEntity[],
  ) {
    this.month = month;
    this.year = year;
    this.totalIncome = totalIncome;
    this.totalExpense = totalExpense;
    this.netBalance = totalIncome - totalExpense;
    this.totalIncomePercent = totalIncomePercent;
    this.totalExpensePercent = totalExpensePercent;
    this.netBalancePercent = netBalancePercent;
    this.profitPercent = netBalancePercent;
    this.transactions = transactions;
  }
}
