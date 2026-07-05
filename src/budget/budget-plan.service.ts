import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { BudgetPeriod } from '../common/enums/budget-period.enum';
import { BudgetEntity } from '../DAL/entities/budget.entity';
import { MonthlyBudgetPlanEntity } from '../DAL/entities/monthly-budget-plan.entity';
import { UserEntity } from '../DAL/entities/user.entity';
import { MonthlyPlanResponse } from './DTO/response/monthly-plan.response';

@Injectable()
export class BudgetPlanService {
  constructor(
    @InjectRepository(MonthlyBudgetPlanEntity)
    private readonly planRepository: EntityRepository<MonthlyBudgetPlanEntity>,
    @InjectRepository(BudgetEntity)
    private readonly budgetRepository: EntityRepository<BudgetEntity>,
  ) {}

  public async getOrCreatePlan(
    userId: number,
    month: Date,
    em?: EntityManager,
  ): Promise<MonthlyBudgetPlanEntity> {
    const repo = em
      ? em.getRepository(MonthlyBudgetPlanEntity)
      : this.planRepository;

    let plan = await repo.findOne({ user: { id: userId }, month });
    if (!plan) {
      const userRef = em
        ? em.getReference(UserEntity, userId)
        : this.planRepository
            .getEntityManager()
            .getReference(UserEntity, userId);

      plan = new MonthlyBudgetPlanEntity(userRef as UserEntity, month, '0.00');
      await (em ?? this.planRepository.getEntityManager())
        .persist(plan)
        .flush();
    }
    return plan;
  }

  public async getPlanWithCalculations(
    userId: number,
    month: Date,
  ): Promise<MonthlyPlanResponse> {
    const plan = await this.getOrCreatePlan(userId, month);

    const em =
      this.budgetRepository.getEntityManager() as unknown as EntityManager;
    const conn = em.getConnection('read');

    const rows = await conn.execute<{ total: string }[]>(
      `SELECT COALESCE(SUM(b.limit_amount), 0)::text as total
       FROM budget_entity b
       JOIN category_entity c ON b.category_id = c.id
       WHERE c.user_id = $1
         AND b.period = $2
         AND b.month = $3
         AND b.is_active = true`,
      [userId, BudgetPeriod.MONTHLY, month],
      'all',
    );

    const totalAllocated = rows[0]?.total ?? '0.00';
    const available = (
      parseFloat(plan.projectedIncome) - parseFloat(totalAllocated)
    ).toFixed(2);

    const response = new MonthlyPlanResponse();
    response.id = plan.id;
    response.month = plan.month;
    response.projectedIncome = plan.projectedIncome;
    response.totalAllocated = parseFloat(totalAllocated).toFixed(2);
    response.available = available;
    return response;
  }
}
