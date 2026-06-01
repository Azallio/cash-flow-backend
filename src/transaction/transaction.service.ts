import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, FilterQuery } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { CategoryService } from '../category/category.service';
import { TransactionEntity } from '../DAL/entities/transaction.entity';
import { UserService } from '../user/user.service';
import { CreateTransactionDto } from './DTO/create-transaction.dto';
import { UpdateTransactionDto } from './DTO/update-transaction.dto';

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
    createTransactionDto: CreateTransactionDto,
  ) {
    const { categoryId, amount, transactionType, description } =
      createTransactionDto;

    const user = await this.userService.getUserById(userId);

    const category = await this.categoryService.getCategoryById(categoryId);

    const newTransaction = new TransactionEntity(
      user,
      category,
      transactionType,
      amount,
      description,
    );

    await this.transactionRepository
      .getEntityManager()
      .persist(newTransaction)
      .flush();

    return newTransaction;
  }

  public async findAll(userId: number) {
    return await this.findByUserId(userId);
  }

  public async findById(id: number) {
    const transaction = await this.transactionRepository.findOne(
      { id },
      { populate: ['category', 'user'] },
    );

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return transaction;
  }

  public async findByUserId(userId: number) {
    const transactions = await this.transactionRepository.find(
      { user: { id: userId } },
      { populate: ['category', 'user'] },
    );

    return transactions;
  }

  public async searchTransactions(
    userId: number,
    categoryId: number,
    searchTerm: string,
  ) {
    const transactions = await this.transactionRepository.find(
      {
        user: { id: userId },
        category: { id: categoryId },
        description: { $ilike: `%${searchTerm}%` },
      },
      { populate: ['category', 'user'] },
    );
    return transactions;
  }

  public async findMany(where: FilterQuery<TransactionEntity>) {
    const transactions = await this.transactionRepository.find(where, {
      populate: ['category', 'user'],
    });

    if (!transactions || transactions.length === 0) {
      throw new Error('Transactions not found');
    }

    return transactions;
  }

  public async updateTransaction(
    id: number,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    const transaction = await this.transactionRepository.findOne({ id });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    this.transactionRepository.assign(transaction, updateTransactionDto);
    await this.transactionRepository.getEntityManager().flush();

    return transaction;
  }

  public async removeTransaction(id: number) {
    const transaction = await this.transactionRepository.findOne({ id });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    await this.transactionRepository
      .getEntityManager()
      .remove(transaction)
      .flush();

    return transaction;
  }
}
