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
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetUser } from '../common/middlewares/decorators/user/getUser';
import { JwtAuthGuard } from '../common/middlewares/guards/jwt-auth.guard';
import { CreateTransactionRequest } from './DTO/create-transaction.request';
import { UpdateTransactionRequest } from './DTO/update-transaction.requets';
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
  @ApiCreatedResponse({
    description: 'Transaction successfully created',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiOkResponse({
    type: CreateTransactionRequest,
    description: 'Transaction successfully created',
  })
  create(
    @GetUser('id') userId: number,
    @Body() createTransactionRequest: CreateTransactionRequest,
  ) {
    return this.transactionService.createTransaction(
      userId,
      createTransactionRequest,
    );
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search transactions',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiOkResponse({
    description: 'Transactions successfully retrieved',
  })
  search(
    @GetUser('id') userId: number,
    @Query('categoryId') categoryId: number,
    @Query('searchTerm') searchTerm: string,
  ) {
    return this.transactionService.searchTransactions(
      userId,
      categoryId,
      searchTerm,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all transactions',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiOkResponse({
    description: 'Transactions successfully retrieved',
  })
  findAll(@GetUser('id') userId: number) {
    return this.transactionService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get transaction by ID',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiOkResponse({
    description: 'Transaction successfully retrieved',
  })
  findOne(@Param('id') id: string) {
    return this.transactionService.findById(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update transaction',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiOkResponse({
    type: UpdateTransactionRequest,
    description: 'Transaction successfully updated',
  })
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionRequest,
  ) {
    return this.transactionService.updateTransaction(+id, updateTransactionDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete transaction',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiOkResponse({
    description: 'Transaction successfully deleted',
  })
  remove(@Param('id') id: string) {
    return this.transactionService.removeTransaction(+id);
  }
}
