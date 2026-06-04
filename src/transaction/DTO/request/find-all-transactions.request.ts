import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { PagingQueryRequest } from '../../../common/DTO/pagingQueryRequest';
import { TransactionType } from '../../../common/enums/transactions-type.enum';

export class FindAllTransactionsRequest extends PagingQueryRequest {
  @IsOptional()
  @IsEnum(TransactionType)
  @ApiPropertyOptional({
    description: 'Filter by transaction type',
    enum: TransactionType,
  })
  transactionType?: TransactionType;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Filter transactions created at or after this date',
    format: 'date-time',
    example: '2026-06-01T00:00:00.000Z',
  })
  startDate?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Filter transactions created at or before this date',
    format: 'date-time',
    example: '2026-06-30T23:59:59.999Z',
  })
  endDate?: string;
}
