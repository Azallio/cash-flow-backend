import {
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { TransactionType } from '../../common/enums/transactions-type.enum';
import { BaseEntity } from './base.entity';
import { TransactionEntity } from './transaction.entity';
import { UserEntity } from './user.entity';

@Entity()
export class CategoryEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, {
    deleteRule: 'cascade',
  })
  user: UserEntity;

  @Property()
  title: string;

  @Property({ nullable: true })
  description?: string;

  @Enum(() => TransactionType)
  transactionType: TransactionType;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.category)
  transactions = new Collection<TransactionEntity>(this);

  constructor(
    user: UserEntity,
    title: string,
    transactionType: TransactionType,
    description?: string,
  ) {
    super();

    this.user = user;
    this.title = title;
    this.transactionType = transactionType;
    this.description = description;
  }
}
