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
import { CreateTransactionDto } from './DTO/create-transaction.dto';
import { UpdateTransactionDto } from './DTO/update-transaction.dto';
import { TransactionService } from './transaction.service';

@ApiTags('Transactions')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
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
    type: CreateTransactionDto,
    description: 'Transaction successfully created',
  })
  create(
    @GetUser('id') userId: number,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this.transactionService.createTransaction(
      userId,
      createTransactionDto,
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
    type: UpdateTransactionDto,
    description: 'Transaction successfully updated',
  })
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
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
