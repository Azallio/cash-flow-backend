import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CategoryService } from '../category/category.service';
import { CategoryEntity } from '../DAL/entities/category.entity';
import { TransactionEntity } from '../DAL/entities/transaction.entity';
import { UserService } from '../user/user.service';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  imports: [MikroOrmModule.forFeature([TransactionEntity, CategoryEntity])],
  controllers: [TransactionController],
  providers: [TransactionService, CategoryService, UserService],
})
export class TransactionModule {}
