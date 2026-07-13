// dto/responses/category-breakdown-item.response.ts
import { ApiProperty } from '@nestjs/swagger';

export class CategoryBreakdownItemResponse {
  @ApiProperty({ example: 3 })
  categoryId: number;

  @ApiProperty({ example: 'Продукты' })
  categoryName: string;

  @ApiProperty({ example: '18750.00' })
  total: string;

  @ApiProperty({
    example: 21.4,
    description: 'Доля от суммы всех категорий в ответе, %',
  })
  percent: number;

  constructor(
    categoryId: number,
    categoryName: string,
    total: string,
    percent: number,
  ) {
    this.categoryId = categoryId;
    this.categoryName = categoryName;
    this.total = total;
    this.percent = percent;
  }
}

export class CategoryBreakdownResponseWrapper {
  @ApiProperty({ type: CategoryBreakdownItemResponse, isArray: true })
  data: CategoryBreakdownItemResponse[];
  constructor(data: CategoryBreakdownItemResponse[]) {
    this.data = data;
  }
}
