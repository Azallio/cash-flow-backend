import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

@Entity()
export class BudgetEntity extends BaseEntity {
  @ManyToOne()
  user: UserEntity;

  @Property()
  title: string;

  @Property()
  startPeriod: Date;

  @Property()
  endPeriod: Date;

  @Property()
  targetAmount: number;

  @Property()
  collectedAmount: number;

  @Property({ nullable: true })
  description?: string;

  constructor(
    user: UserEntity,
    title: string,
    targetAmount: number,
    collectedAmount: number,
    startPeriod: Date,
    endPeriod: Date,
    description?: string,
  ) {
    super();
    this.user = user;
    this.title = title;
    this.targetAmount = targetAmount;
    this.collectedAmount = collectedAmount;
    this.startPeriod = startPeriod;
    this.endPeriod = endPeriod;
    this.description = description;
  }
}
