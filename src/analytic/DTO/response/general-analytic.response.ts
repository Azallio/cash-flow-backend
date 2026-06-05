import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionEntity } from '../../../DAL/entities/transaction.entity';
import { AnalyticPeriod } from '../../../common/enums/analytic-period.enum';
import { TransactionResponse } from '../../../transaction/DTO/response/transaction.response';

export class GeneralAnalyticResponse {
  @ApiPropertyOptional({
    enum: AnalyticPeriod,
    example: AnalyticPeriod.MONTH,
  })
  period?: AnalyticPeriod;

  @ApiProperty({ example: 12500 })
  totalIncome: number;

  @ApiProperty({ example: 4300 })
  totalExpense: number;

  @ApiProperty({ example: 8200 })
  netBalance: number;

  @ApiPropertyOptional({
    example: 25.5,
    description:
      'Percentage change of current month total income compared to previous month total income',
  })
  totalIncomePercent?: number;

  @ApiPropertyOptional({
    example: -10.25,
    description:
      'Percentage change of current month total expense compared to previous month total expense',
  })
  totalExpensePercent?: number;

  @ApiPropertyOptional({
    example: -15.75,
    description:
      'Percentage change of current month net balance compared to previous month net balance',
  })
  netBalancePercent?: number;

  @ApiPropertyOptional({
    example: -15.75,
    description:
      'Alias for netBalancePercent kept for API compatibility with monthly analytics',
  })
  profitPercent?: number;

  @ApiProperty({
    type: TransactionResponse,
    isArray: true,
  })
  transactions: TransactionEntity[];

  constructor(
    totalIncome: number,
    totalExpense: number,
    transactions: TransactionEntity[],
    period?: AnalyticPeriod,
    totalIncomePercent?: number,
    totalExpensePercent?: number,
    netBalancePercent?: number,
  ) {
    this.period = period;
    this.totalIncome = totalIncome;
    this.totalExpense = totalExpense;
    this.netBalance = totalIncome - totalExpense;
    this.transactions = transactions;
    this.totalIncomePercent = totalIncomePercent;
    this.totalExpensePercent = totalExpensePercent;
    this.netBalancePercent = netBalancePercent;
    this.profitPercent = netBalancePercent;
  }
}
