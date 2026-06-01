export class AnalyticByCategoryResponse {
  categoryId: number;
  totalAmount: number;

  constructor(categoryId: number, totalAmount: number) {
    this.categoryId = categoryId;
    this.totalAmount = totalAmount;
  }
}
