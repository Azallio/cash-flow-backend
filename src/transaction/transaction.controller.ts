import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  ApiCreatedResponseWrapped,
  ApiOkResponseWrapped,
  ApiOkResponseWrappedPagingArray,
} from '../common/DTO/apiResponse';
import { PagingQueryRequest } from '../common/DTO/pagingQueryRequest';
import { GetUser } from '../common/middlewares/decorators/user/getUser';
import { JwtAuthGuard } from '../common/middlewares/guards/jwt-auth.guard';
import { CreateTransactionRequest } from './DTO/request/create-transaction.request';
import { FindAllTransactionsRequest } from './DTO/request/find-all-transactions.request';
import { UpdateTransactionRequest } from './DTO/request/update-transaction.request';
import { TransactionResponse } from './DTO/response/transaction.response';
import { TransactionService } from './transaction.service';

@ApiTags('Transactions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiOperation({
    summary: 'Create transaction',
  })
  @ApiCreatedResponseWrapped(TransactionResponse, {
    description: 'Transaction successfully created',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiOkResponseWrapped(TransactionResponse, {
    description: 'Transaction successfully created',
  })
  create(
    @GetUser('userId') userId: number,
    @Body() createTransactionRequest: CreateTransactionRequest,
  ) {
    return this.transactionService.createTransaction(
      userId,
      createTransactionRequest,
    );
  }

  @Get('category/:categoryId')
  @ApiOperation({
    summary: 'Search transactions',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiOkResponseWrappedPagingArray(
    TransactionResponse,
    'Transactions successfully retrieved',
  )
  search(
    @GetUser('userId') userId: number,
    @Param('categoryId') categoryId: number,
    @Query() paging: PagingQueryRequest,
  ) {
    return this.transactionService.searchTransactions(
      userId,
      categoryId,
      paging,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all transactions',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiOkResponseWrappedPagingArray(
    TransactionResponse,
    'Transactions successfully retrieved',
  )
  findAll(
    @GetUser('userId') userId: number,
    @Query() query: FindAllTransactionsRequest,
  ) {
    const { transactionType, ...paging } = query;
    return this.transactionService.findAll(userId, paging, transactionType);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get transaction by ID',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiOkResponseWrapped(TransactionResponse, {
    description: 'Transaction successfully retrieved',
  })
  findOne(@GetUser('userId') userId: number, @Param('id') id: string) {
    return this.transactionService.findById(+id, userId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update transaction',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiOkResponseWrapped(TransactionResponse, {
    description: 'Transaction successfully updated',
  })
  update(
    @GetUser('userId') userId: number,
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionRequest,
  ) {
    return this.transactionService.updateTransaction(
      +id,
      userId,
      updateTransactionDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete transaction',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiOkResponseWrapped(TransactionResponse, {
    description: 'Transaction successfully deleted',
  })
  remove(@GetUser('userId') userId: number, @Param('id') id: string) {
    return this.transactionService.removeTransaction(+id, userId);
  }
}
