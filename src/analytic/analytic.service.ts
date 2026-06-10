import { Injectable } from '@nestjs/common';
import { CategoryEntity } from '../DAL/entities/category.entity';
import { TransactionEntity } from '../DAL/entities/transaction.entity';
import { CategoryService } from '../category/category.service';
import { TopAnalyticObject } from '../common/types/top-analytic-object.type';
import { getAnalyticPeriodRange } from '../common/utils/getAnalyticPeriodRange.util';
import { TransactionService } from '../transaction/transaction.service';
import { AnalyticByCategoryRequest } from './DTO/request/analytic-by-category.request';
import { GeneralAnalyticRequest } from './DTO/request/general-analytic.request';
import { AnalyticByCategoryResponse } from './DTO/response/analytic-by-category.response';
import { AnalyticByTopCategoriesResponse } from './DTO/response/analytic-by-top-categories.response';
import { GeneralAnalyticResponse } from './DTO/response/general-analytic.response';

@Injectable()
export class AnalyticService {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly categoryService: CategoryService,
  ) {}

  private calculateTotals(transactions: TransactionEntity[]) {
    const totalIncome = transactions
      .filter((transaction) => transaction.transactionType === 'income')
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const totalExpense = transactions
      .filter((transaction) => transaction.transactionType === 'expense')
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    return {
      totalIncome,
      totalExpense,
    };
  }

  private calculatePercentChange(
    currentValue: number,
    previousValue: number,
  ): number {
    if (previousValue === 0) {
      if (currentValue === 0) {
        return 0;
      }

      return currentValue > 0 ? 100 : -100;
    }

    const percent =
      ((currentValue - previousValue) / Math.abs(previousValue)) * 100;

    return Math.round(percent * 100) / 100;
  }

  public async getUserGeneralAnalytics(
    userId: number,
    dto: GeneralAnalyticRequest,
  ): Promise<GeneralAnalyticResponse> {
    const { currentStart, currentEnd, previousStart, previousEnd } =
      getAnalyticPeriodRange(dto.period);

    const transactions = await this.transactionService.findMany({
      user: { id: userId },
      ...(currentStart != null && currentEnd != null
        ? {
            createdAt: {
              $gte: currentStart,
              $lte: currentEnd,
            },
          }
        : {}),
    });

    const { totalIncome, totalExpense } = this.calculateTotals(transactions);

    if (dto.period != null && previousStart != null && previousEnd != null) {
      const previousTransactions = await this.transactionService.findMany({
        user: { id: userId },
        createdAt: {
          $gte: previousStart,
          $lte: previousEnd,
        },
      });

      const { totalIncome: previousIncome, totalExpense: previousExpense } =
        this.calculateTotals(previousTransactions);

      const currentNetBalance = totalIncome - totalExpense;
      const previousNetBalance = previousIncome - previousExpense;

      return new GeneralAnalyticResponse(
        totalIncome,
        totalExpense,
        transactions,
        dto.period,
        this.calculatePercentChange(totalIncome, previousIncome),
        this.calculatePercentChange(totalExpense, previousExpense),
        this.calculatePercentChange(currentNetBalance, previousNetBalance),
      );
    }

    return new GeneralAnalyticResponse(
      totalIncome,
      totalExpense,
      transactions,
      dto.period,
    );
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

  public async getTopTenCategories(
    userId: number,
  ): Promise<AnalyticByTopCategoriesResponse> {
    const categories = await this.categoryService.getCategoriesByUserId(
      userId,
      {
        take: 100,
        skip: 0,
      },
    );

    const topCategoriesByIncome: TopAnalyticObject<CategoryEntity>[] = [];
    const topCategoriesByExpense: TopAnalyticObject<CategoryEntity>[] = [];

    for (const category of categories.items) {
      const transactions = await this.transactionService.findMany({
        user: { id: userId },
        category: { id: category.id },
      });
      const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);

      if (category.transactionType === 'income') {
        topCategoriesByIncome.push({ itemOfTop: category, totalAmount });
      } else if (category.transactionType === 'expense') {
        topCategoriesByExpense.push({ itemOfTop: category, totalAmount });
      }
    }

    topCategoriesByIncome.sort((a, b) => b.totalAmount - a.totalAmount);
    topCategoriesByExpense.sort((a, b) => b.totalAmount - a.totalAmount);

    return new AnalyticByTopCategoriesResponse(
      topCategoriesByIncome,
      topCategoriesByExpense,
    );
  }
}
