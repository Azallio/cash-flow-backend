import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType } from '../../../common/enums/transactions-type.enum';

export class TransactionResponse {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({
    example: TransactionType.INCOME,
    enum: TransactionType,
  })
  transactionType!: TransactionType;

  @ApiProperty({ example: 5000 })
  amount!: number;

  @ApiPropertyOptional({
    example: 'Salary for June',
    nullable: true,
  })
  description?: string;

  @ApiProperty({ example: 2 })
  categoryId!: number;

  @ApiProperty({ example: 1 })
  userId!: number;

  @ApiProperty({
    example: '2026-06-01T00:00:00.000Z',
    format: 'date-time',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2026-06-01T00:00:00.000Z',
    format: 'date-time',
  })
  updatedAt!: Date;
}
