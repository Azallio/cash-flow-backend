import { TransactionType } from '../../common/enums/transactions-type.enum';

export class CreateTransactionDto {
  categoryId: number;
  amount: number;
  transactionType: TransactionType;
  description?: string;

  constructor(
    categoryId: number,
    amount: number,
    transactionType: TransactionType,
    description?: string,
  ) {
    this.categoryId = categoryId;
    this.amount = amount;
    this.transactionType = transactionType;
    this.description = description;
  }
}
