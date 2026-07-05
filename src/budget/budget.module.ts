import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { BudgetAdjustmentEntity } from '../DAL/entities/budget-adjustment.entity';
import { BudgetEntity } from '../DAL/entities/budget.entity';
import { CategoryEntity } from '../DAL/entities/category.entity';
import { MonthlyBudgetPlanEntity } from '../DAL/entities/monthly-budget-plan.entity';
import { TransactionEntity } from '../DAL/entities/transaction.entity';
import { UserModule } from '../user/user.module';
import { BudgetGenerationService } from './budget-generation.service';
import { BudgetPlanService } from './budget-plan.service';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      BudgetEntity,
      BudgetAdjustmentEntity,
      MonthlyBudgetPlanEntity,
      CategoryEntity,
      TransactionEntity,
    ]),
    UserModule,
  ],
  controllers: [BudgetController],
  providers: [BudgetService, BudgetPlanService, BudgetGenerationService],
})
export class BudgetModule {}
