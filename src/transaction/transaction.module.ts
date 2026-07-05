import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CategoryService } from '../category/category.service';
import { CategoryEntity } from '../DAL/entities/category.entity';
import { TransactionEntity } from '../DAL/entities/transaction.entity';
import { UserEntity } from '../DAL/entities/user.entity';
import { UserModule } from '../user/user.module';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([TransactionEntity, CategoryEntity, UserEntity]),
    UserModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService, CategoryService],
})
export class TransactionModule {}
