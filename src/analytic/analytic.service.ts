import { Injectable } from '@nestjs/common';
import { TransactionService } from '../transaction/transaction.service';
import { AnalyticByCategoryRequest } from './DTO/request/analytic-by-category.request';
import { GeneralAnalyticRequest } from './DTO/request/general-analytic.request';
import { MonthlyAnalyticRequest } from './DTO/request/monthly-analytic.request';
import { YearlyAnalyticRequest } from './DTO/request/yearly-analytic.request';
import { AnalyticByCategoryResponse } from './DTO/response/analytic-by-category.response';
import { GeneralAnalyticResponse } from './DTO/response/general-analytic.response';
import { MonthlyAnalyticResponse } from './DTO/response/monthly-analytic.response';
import { YearlyAnalyticResponse } from './DTO/response/yearly-analytic.response';

@Injectable()
export class AnalyticService {
  constructor(private readonly transactionService: TransactionService) {}

  private calculateProfitProcent(
    currentNetBalance: number,
    previousNetBalance: number,
  ): number {
    if (previousNetBalance === 0) {
      if (currentNetBalance === 0) {
        return 0;
      }

      return currentNetBalance > 0 ? 100 : -100;
    }

    const percent =
      ((currentNetBalance - previousNetBalance) /
        Math.abs(previousNetBalance)) *
      100;

    return Math.round(percent * 100) / 100;
  }

  public async getUserGeneralAnalytics(
    userId: number,
    dto: GeneralAnalyticRequest,
  ): Promise<GeneralAnalyticResponse> {
    const transactions = await this.transactionService.findMany({
      user: { id: userId },
      createdAt: { $gte: dto.startDate, $lte: dto.endDate },
    });

    const totalIncome = transactions
      .filter((t) => t.transactionType === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter((t) => t.transactionType === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return new GeneralAnalyticResponse(totalIncome, totalExpense);
  }

  public async getUserCategoryAnalytics(
    userId: number,
    dto: AnalyticByCategoryRequest,
  ): Promise<AnalyticByCategoryResponse> {
    const transactions = await this.transactionService.findMany({
      user: { id: userId },
      category: { id: dto.categoryId },
      createdAt: { $gte: dto.startDate, $lte: dto.endDate },
    });

    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);

    return new AnalyticByCategoryResponse(dto.categoryId, totalAmount);
  }

  public async getUserMonthlyAnalytics(
    userId: number,
    dto: MonthlyAnalyticRequest,
  ): Promise<MonthlyAnalyticResponse> {
    const currentMonthStart = new Date(dto.year, dto.month - 1, 1);
    const currentMonthEnd = new Date(dto.year, dto.month, 0, 23, 59, 59, 999);

    const previousMonthDate = new Date(dto.year, dto.month - 2, 1);
    const previousMonthStart = new Date(
      previousMonthDate.getFullYear(),
      previousMonthDate.getMonth(),
      1,
    );
    const previousMonthEnd = new Date(
      previousMonthDate.getFullYear(),
      previousMonthDate.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    const transactions = await this.transactionService.findMany({
      user: { id: userId },
      createdAt: {
        $gte: currentMonthStart,
        $lte: currentMonthEnd,
      },
    });

    const previousMonthTransactions = await this.transactionService.findMany({
      user: { id: userId },
      createdAt: {
        $gte: previousMonthStart,
        $lte: previousMonthEnd,
      },
    });

    const totalIncome = transactions
      .filter((t) => t.transactionType === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter((t) => t.transactionType === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const previousMonthIncome = previousMonthTransactions
      .filter((t) => t.transactionType === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const previousMonthExpense = previousMonthTransactions
      .filter((t) => t.transactionType === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const currentNetBalance = totalIncome - totalExpense;
    const previousNetBalance = previousMonthIncome - previousMonthExpense;
    const profitProcent = this.calculateProfitProcent(
      currentNetBalance,
      previousNetBalance,
    );

    return new MonthlyAnalyticResponse(
      dto.month,
      dto.year,
      totalIncome,
      totalExpense,
      profitProcent,
      transactions,
    );
  }

  public async getUserYearlyAnalytics(
    userId: number,
    dto: YearlyAnalyticRequest,
  ): Promise<YearlyAnalyticResponse> {
    const transactions = await this.transactionService.findMany({
      user: { id: userId },
      createdAt: {
        $gte: new Date(dto.year, 0, 1),
        $lte: new Date(dto.year, 11, 31),
      },
    });

    return new YearlyAnalyticResponse(
      dto.year,
      transactions
        .filter((t) => t.transactionType === 'income')
        .reduce((sum, t) => sum + t.amount, 0),
      transactions
        .filter((t) => t.transactionType === 'expense')
        .reduce((sum, t) => sum + t.amount, 0),
      transactions,
    );
  }
}
