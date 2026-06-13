import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { BudgetEntity } from '../DAL/entities/budget.entity';
import { UserService } from '../user/user.service';
import { CreateBudgetRequest } from './DTO/request/create-budget.request';
import { UpdateBudgetRequest } from './DTO/request/update-budget.request';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(BudgetEntity)
    private readonly budgetRepository: EntityRepository<BudgetEntity>,
    private readonly userService: UserService,
  ) {}

  public async create(
    createBudgetRequest: CreateBudgetRequest,
    userId: number,
  ) {
    const user = await this.userService.getUserById(userId);

    const budget = new BudgetEntity(
      user,
      createBudgetRequest.title,
      createBudgetRequest.targetAmount,
      createBudgetRequest.collectedAmount,
      createBudgetRequest.startPeriod,
      createBudgetRequest.endPeriod,
      createBudgetRequest.description,
    );

    budget.user = user;

    await this.budgetRepository.getEntityManager().persist(budget).flush();

    return budget;
  }

  public async findAll(userId: number) {
    return await this.budgetRepository.find({ user: userId });
  }

  public async findOne(id: number) {
    return await this.budgetRepository.findOne({ id });
  }

  public async update(id: number, updateBudgetRequest: UpdateBudgetRequest) {
    const budget = await this.budgetRepository.findOne({ id });

    if (!budget) {
      throw new Error(`Budget with id ${id} not found`);
    }

    this.budgetRepository.assign(budget, updateBudgetRequest);
    await this.budgetRepository.getEntityManager().flush();

    return budget;
  }

  public async remove(id: number) {
    return this.budgetRepository.nativeDelete({ id });
  }
}
