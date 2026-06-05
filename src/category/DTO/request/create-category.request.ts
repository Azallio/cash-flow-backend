import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TransactionType } from '../../../common/enums/transactions-type.enum';

export class CreateCategoryRequest {
  @ApiProperty({
    description: 'Title of the category',
    example: 'Food',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Type of transactions for this category',
    example: TransactionType.EXPENSE,
    enum: TransactionType,
  })
  @IsEnum(TransactionType)
  transactionType: TransactionType;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Description of the category',
    example: 'Category for food expenses',
    required: false,
  })
  description?: string;

  constructor(
    title: string,
    transactionType: TransactionType,
    description?: string,
  ) {
    this.title = title;
    this.transactionType = transactionType;
    this.description = description;
  }
}
