export class GeneralAnalyticResponse {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;

  constructor(totalIncome: number, totalExpense: number) {
    this.totalIncome = totalIncome;
    this.totalExpense = totalExpense;
    this.netBalance = totalIncome - totalExpense;
  }
}
