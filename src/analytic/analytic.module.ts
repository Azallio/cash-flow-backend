import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CategoryService } from '../category/category.service';
import { CategoryEntity } from '../DAL/entities/category.entity';
import { TransactionEntity } from '../DAL/entities/transaction.entity';
import { UserEntity } from '../DAL/entities/user.entity';
import { TransactionService } from '../transaction/transaction.service';
import { UserModule } from '../user/user.module';
import { AnalyticController } from './analytic.controller';
import { AnalyticService } from './analytic.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([TransactionEntity, CategoryEntity, UserEntity]),
    UserModule,
  ],
  controllers: [AnalyticController],
  providers: [AnalyticService, TransactionService, CategoryService],
})
export class AnalyticModule {}
