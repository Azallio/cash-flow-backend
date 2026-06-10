import { ApiProperty } from '@nestjs/swagger';
import { TopAnalyticObject } from '../../../common/types/top-analytic-object.type';
import { CategoryEntity } from '../../../DAL/entities/category.entity';

export class AnalyticByTopCategoriesResponse {
  @ApiProperty({
    example: [
      {
        category: {
          id: 1,
          name: 'Food',
          transactionType: 'expense',
        },
        totalAmount: 500,
      },
    ],
  })
  topCategoriesByIncome: TopAnalyticObject<CategoryEntity>[];

  @ApiProperty({
    example: [
      {
        category: {
          id: 1,
          name: 'Food',
          transactionType: 'expense',
        },
        totalAmount: 500,
      },
    ],
  })
  topCategoriesByExpense: TopAnalyticObject<CategoryEntity>[];

  constructor(
    topCategoriesByIncome: TopAnalyticObject<CategoryEntity>[],
    topCategoriesByExpense: TopAnalyticObject<CategoryEntity>[],
  ) {
    this.topCategoriesByIncome = topCategoriesByIncome;
    this.topCategoriesByExpense = topCategoriesByExpense;
  }
}
