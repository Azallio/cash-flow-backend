import { GeneralAnalyticRequest } from './general-analytic.request';

export class AnalyticByCategoryRequest extends GeneralAnalyticRequest {
  categoryId: number;

  constructor(startDate: Date, endDate: Date, categoryId: number) {
    super(startDate, endDate);
    this.categoryId = categoryId;
  }
}
