import { ApiProperty } from '@nestjs/swagger';

export class AnalyticByCategoryResponse {
  @ApiProperty({ example: 2 })
  categoryId: number;

  @ApiProperty({ example: 9700 })
  totalAmount: number;

  constructor(categoryId: number, totalAmount: number) {
    this.categoryId = categoryId;
    this.totalAmount = totalAmount;
  }
}
