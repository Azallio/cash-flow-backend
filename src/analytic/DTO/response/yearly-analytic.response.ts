import { TransactionEntity } from '../../../DAL/entities/transaction.entity';

export class YearlyAnalyticResponse {
  year: number;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
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
