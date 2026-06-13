import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { BudgetEntity } from '../DAL/entities/budget.entity';
import { UserService } from '../user/user.service';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';

@Module({
  imports: [MikroOrmModule.forFeature([BudgetEntity])],
  controllers: [BudgetController],
  providers: [BudgetService, UserService],
})
export class BudgetModule {}
