import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CategoryService } from '../category/category.service';
import { CategoryEntity } from '../DAL/entities/category.entity';
import { TransactionEntity } from '../DAL/entities/transaction.entity';
import { UserEntity } from '../DAL/entities/user.entity';
import { TransactionService } from '../transaction/transaction.service';
import { UserService } from '../user/user.service';
import { AnalyticController } from './analytic.controller';
import { AnalyticService } from './analytic.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([TransactionEntity, CategoryEntity, UserEntity]),
  ],
  controllers: [AnalyticController],
  providers: [
    AnalyticService,
    TransactionService,
    CategoryService,
    UserService,
  ],
})
export class AnalyticModule {}
