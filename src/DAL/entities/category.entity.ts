import { Collection, Entity, ManyToOne, OneToMany } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { TransactionEntity } from './transaction.entity';
import { UserEntity } from './user.entity';

@Entity({ tableName: 'categories' })
export class CategoryEntity extends BaseEntity {
  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.category)
  transactions = new Collection<TransactionEntity>(this);

  constructor(user: UserEntity) {
    super();

    this.user = user;
  }
}
