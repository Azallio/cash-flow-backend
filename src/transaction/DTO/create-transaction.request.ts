import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { TransactionType } from '../../common/enums/transactions-type.enum';

export class CreateTransactionRequest {
  @ApiProperty({
    description: 'ID of the category',
    example: 1,
  })
  @IsInt()
  categoryId: number;

  @ApiProperty({
    description: 'Amount of the transaction',
    example: 100.0,
  })
  @IsInt()
  amount: number;

  @ApiProperty({
    description: 'Type of the transaction',
    example: TransactionType.INCOME,
    enum: TransactionType,
  })
  @IsEnum(TransactionType)
  transactionType: TransactionType;

  @ApiProperty({
    description: 'Description of the transaction',
    example: 'Salary for June',
    required: false,
  })
  @IsString()
  @IsOptional()
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
