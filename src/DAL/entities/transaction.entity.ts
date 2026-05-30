import { Entity, Enum, ManyToOne } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { CategoryEntity } from './category.entity';
import { UserEntity } from './user.entity';

export enum TransactionType {
  EXPENSE = 'expense',
  INCOME = 'income',
}

@Entity({ tableName: 'transactions' })
export class TransactionEntity extends BaseEntity {
  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @ManyToOne(() => CategoryEntity)
  category: CategoryEntity;

  @Enum(() => TransactionType)
  transactionType: TransactionType;

  constructor(
    user: UserEntity,
    category: CategoryEntity,
    transactionType: TransactionType,
  ) {
    super();

    this.user = user;
    this.category = category;
    this.transactionType = transactionType;
  }
}
