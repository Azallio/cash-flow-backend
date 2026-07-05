import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

@Entity()
@Unique({ properties: ['user', 'month'] })
export class MonthlyBudgetPlanEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, { deleteRule: 'cascade' })
  user: UserEntity;

  /** Normalized to 1st of month */
  @Property({ columnType: 'date' })
  month: Date;

  /** Income baseline the month's budgets are allocated against */
  @Property({ columnType: 'decimal(12,2)' })
  projectedIncome: string;

  constructor(user: UserEntity, month: Date, projectedIncome: string) {
    super();
    this.user = user;
    this.month = month;
    this.projectedIncome = projectedIncome;
  }
}
