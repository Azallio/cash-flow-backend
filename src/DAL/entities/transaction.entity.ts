import { Entity, Enum, ManyToOne } from '@mikro-orm/core';
import { TransactionType } from '../../common/enums/transactions-type.enum';
import { BaseEntity } from './base.entity';
import { CategoryEntity } from './category.entity';
import { UserEntity } from './user.entity';

@Entity()
export class TransactionEntity extends BaseEntity {
  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @ManyToOne(() => CategoryEntity)
  category: CategoryEntity;

  @Enum(() => TransactionType)
  transactionType: TransactionType;

  amount: number;

  constructor(
    user: UserEntity,
    category: CategoryEntity,
    transactionType: TransactionType,
    amount: number,
  ) {
    super();

    this.user = user;
    this.category = category;
    this.transactionType = transactionType;
    this.amount = amount;
  }
}
