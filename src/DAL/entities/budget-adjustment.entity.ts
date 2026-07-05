import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';
import { AdjustmentSource } from '../../common/enums/adjustment-source.enum';
import { BaseEntity } from './base.entity';
import { BudgetEntity } from './budget.entity';

@Entity()
export class BudgetAdjustmentEntity extends BaseEntity {
  @ManyToOne(() => BudgetEntity, { deleteRule: 'cascade' })
  targetBudget: BudgetEntity;

  @Property({ columnType: 'decimal(12,2)' })
  amount: string;

  @Enum(() => AdjustmentSource)
  source: AdjustmentSource;

  /** Populated only when source = BUDGET_REALLOCATION */
  @ManyToOne(() => BudgetEntity, { nullable: true, deleteRule: 'set null' })
  sourceBudget?: BudgetEntity;

  @Property({ nullable: true })
  reason?: string;

  constructor(
    targetBudget: BudgetEntity,
    amount: string,
    source: AdjustmentSource,
    sourceBudget?: BudgetEntity,
    reason?: string,
  ) {
    super();
    this.targetBudget = targetBudget;
    this.amount = amount;
    this.source = source;
    this.sourceBudget = sourceBudget;
    this.reason = reason;
  }
}
