import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PagingQueryRequest } from '../../../common/DTO/pagingQueryRequest';
import { TransactionType } from '../../../common/enums/transactions-type.enum';

export class SearchTransactionsRequest extends PagingQueryRequest {
  @IsOptional()
  @IsEnum(TransactionType)
  @ApiPropertyOptional({
    description: 'Filter category transactions by type',
    enum: TransactionType,
  })
  transactionType?: TransactionType;
}
