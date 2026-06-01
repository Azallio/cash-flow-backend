import { Collection, Entity, ManyToOne, OneToMany } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { TransactionEntity } from './transaction.entity';
import { UserEntity } from './user.entity';

@Entity()
export class CategoryEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, {
    deleteRule: 'cascade',
  })
  user: UserEntity;

  title: string;

  description?: string;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.category)
  transactions = new Collection<TransactionEntity>(this);

  constructor(user: UserEntity, title: string, description?: string) {
    super();

    this.user = user;
    this.title = title;
    this.description = description;
  }
}
