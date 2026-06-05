import { PartialType } from '@nestjs/swagger';
import { TransactionType } from '../../../common/enums/transactions-type.enum';
import { CreateCategoryRequest } from './create-category.request';

export class UpdateCategoryRequest extends PartialType(CreateCategoryRequest) {
  id: number;

  constructor(
    userId: number,
    title?: string,
    transactionType?: TransactionType,
    description?: string,
  ) {
    super(title, transactionType, description);

    this.id = userId;
  }
}
