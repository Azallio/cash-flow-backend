import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

@Entity({ tableName: 'refresh_tokens' })
export class RefreshTokenEntity extends BaseEntity {
  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @Property()
  tokenHash: string;

  @Property()
  expiresAt: Date;

  constructor(user: UserEntity, tokenHash: string, expiresAt: Date) {
    super();

    this.user = user;
    this.tokenHash = tokenHash;
    this.expiresAt = expiresAt;
  }
}
