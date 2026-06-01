import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '../../common/enums/transactions-type.enum';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'ID of the category',
    example: 1,
  })
  categoryId: number;

  @ApiProperty({
    description: 'Amount of the transaction',
    example: 100.0,
  })
  amount: number;

  @ApiProperty({
    description: 'Type of the transaction',
    example: TransactionType.INCOME,
    enum: TransactionType,
  })
  transactionType: TransactionType;

  @ApiProperty({
    description: 'Description of the transaction',
    example: 'Salary for June',
    required: false,
  })
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
