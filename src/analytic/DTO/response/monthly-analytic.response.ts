import { TransactionEntity } from '../../../DAL/entities/transaction.entity';

export class MonthlyAnalyticResponse {
  month: number;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  transactions: TransactionEntity[];
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
