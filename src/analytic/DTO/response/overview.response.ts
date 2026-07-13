// dto/responses/overview.response.ts
import { ApiProperty } from '@nestjs/swagger';
import { MetricWithChangeResponse } from './metric-with-change.response';

export class OverviewResponse {
  @ApiProperty({ type: MetricWithChangeResponse })
  income: MetricWithChangeResponse;

  @ApiProperty({ type: MetricWithChangeResponse })
  expense: MetricWithChangeResponse;

  @ApiProperty({
    type: MetricWithChangeResponse,
    description: 'Доходы минус расходы за период (поток, не остаток на счетах)',
  })
  savings: MetricWithChangeResponse;

  @ApiProperty({
    type: MetricWithChangeResponse,
    description:
      'Накопленный остаток на конец периода (сумма всех транзакций с начала учёта)',
  })
  balance: MetricWithChangeResponse;

  constructor(
    income: MetricWithChangeResponse,
    expense: MetricWithChangeResponse,
    savings: MetricWithChangeResponse,
    balance: MetricWithChangeResponse,
  ) {
    this.income = income;
    this.expense = expense;
    this.savings = savings;
    this.balance = balance;
  }
}
