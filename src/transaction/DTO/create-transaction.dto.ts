import { TransactionType } from '../../common/enums/transactions-type.enum';

export class CreateTransactionDto {
  userId: number;
  categoryId: number;
  amount: number;
  transactionType: TransactionType;
  description?: string;

  constructor(
    userId: number,
    categoryId: number,
    amount: number,
    transactionType: TransactionType,
    description?: string,
  ) {
    this.userId = userId;
    this.categoryId = categoryId;
    this.amount = amount;
    this.transactionType = transactionType;
    this.description = description;
  }
}
