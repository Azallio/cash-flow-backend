import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';

@Entity()
export class UserEntity extends BaseEntity {
  @Property()
  name: string;

  constructor(name: string) {
    super();

    this.name = name;
  }
}
