import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';
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

  @Property()
  amount: number;

  @Property({ nullable: true })
  description?: string;

  constructor(
    user: UserEntity,
    category: CategoryEntity,
    transactionType: TransactionType,
    amount: number,
    description?: string,
    createdAt?: Date,
  ) {
    super(createdAt);

    this.user = user;
    this.category = category;
    this.transactionType = transactionType;
    this.amount = amount;
    this.description = description;
  }
}
