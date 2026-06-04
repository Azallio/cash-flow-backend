import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, FilterQuery } from '@mikro-orm/postgresql';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryService } from '../category/category.service';
import { PagingArrayResponse } from '../common/DTO/pagingArrayResponse';
import { PagingQueryRequest } from '../common/DTO/pagingQueryRequest';
import { TransactionType } from '../common/enums/transactions-type.enum';
import { TransactionEntity } from '../DAL/entities/transaction.entity';
import { UserService } from '../user/user.service';
import { CreateTransactionRequest } from './DTO/request/create-transaction.request';
import { UpdateTransactionRequest } from './DTO/request/update-transaction.request';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: EntityRepository<TransactionEntity>,
    private readonly categoryService: CategoryService,
    private readonly userService: UserService,
  ) {}

  public async createTransaction(
    userId: number,
    createTransactionRequest: CreateTransactionRequest,
  ) {
    const { categoryId, amount, transactionType, description, createdAt } =
      createTransactionRequest;

    const user = await this.userService.getUserById(userId);

    const category = await this.categoryService.getCategoryById(
      categoryId,
      userId,
    );

    const newTransaction = new TransactionEntity(
      user,
      category,
      transactionType,
      amount,
      description,
      createdAt ? new Date(createdAt) : new Date(),
    );

    await this.transactionRepository
      .getEntityManager()
      .persist(newTransaction)
      .flush();

    return newTransaction;
  }

  public async findAll(
    userId: number,
    paging: PagingQueryRequest,
    transactionType?: TransactionType,
    startDate?: string,
    endDate?: string,
  ) {
    return await this.findByUserId(
      userId,
      paging,
      transactionType,
      startDate,
      endDate,
    );
  }

  public async findById(id: number, userId: number) {
    const transaction = await this.transactionRepository.findOne(
      { id, user: { id: userId } },
      { populate: ['category', 'user'] },
    );

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  public async findByUserId(
    userId: number,
    paging: PagingQueryRequest,
    transactionType?: TransactionType,
    startDate?: string,
    endDate?: string,
  ) {
    const createdAtFilter: { $gte?: Date; $lte?: Date } = {};

    if (startDate) {
      createdAtFilter.$gte = new Date(startDate);
    }

    if (endDate) {
      createdAtFilter.$lte = new Date(endDate);
    }

    const where: FilterQuery<TransactionEntity> = {
      user: { id: userId },
      ...(transactionType ? { transactionType } : {}),
      ...(Object.keys(createdAtFilter).length > 0
        ? { createdAt: createdAtFilter }
        : {}),
    };

    const [items, totalItems] = await this.transactionRepository.findAndCount(
      where,
      {
        populate: ['category', 'user'],
        offset: paging.skip,
        limit: paging.take,
        orderBy: { createdAt: 'desc' },
      },
    );

    return new PagingArrayResponse(items, totalItems);
  }

  public async searchTransactions(
    userId: number,
    categoryId: number,
    paging: PagingQueryRequest,
  ) {
    const [items, totalItems] = await this.transactionRepository.findAndCount(
      {
        user: { id: userId },
        category: { id: categoryId },
      },
      {
        populate: ['category', 'user'],
        offset: paging.skip,
        limit: paging.take,
        orderBy: { createdAt: 'desc' },
      },
    );

    return new PagingArrayResponse(items, totalItems);
  }

  public async findMany(where: FilterQuery<TransactionEntity>) {
    const transactions = await this.transactionRepository.find(where, {
      populate: ['category', 'user'],
    });

    return transactions;
  }

  public async updateTransaction(
    id: number,
    userId: number,
    updateTransactionDto: UpdateTransactionRequest,
  ) {
    const transaction = await this.transactionRepository.findOne({
      id,
      user: { id: userId },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    this.transactionRepository.assign(transaction, updateTransactionDto);
    await this.transactionRepository.getEntityManager().flush();

    return transaction;
  }

  public async removeTransaction(id: number, userId: number) {
    const transaction = await this.transactionRepository.findOne({
      id,
      user: { id: userId },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    await this.transactionRepository
      .getEntityManager()
      .remove(transaction)
      .flush();

    return transaction;
  }
}
