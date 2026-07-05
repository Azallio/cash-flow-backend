import {
  Collection,
  Entity,
  OneToMany,
  Property,
  Unique,
} from '@mikro-orm/core';
import { UserRole } from '../../common/enums/user-role.enum';
import { BaseEntity } from './base.entity';
import { CategoryEntity } from './category.entity';
import { RefreshTokenEntity } from './refresh-token.entity';
import { TransactionEntity } from './transaction.entity';

@Entity()
export class UserEntity extends BaseEntity {
  @Unique()
  @Property()
  email: string;

  @Property()
  passwordHash: string;

  @OneToMany(() => RefreshTokenEntity, (refreshToken) => refreshToken.user)
  refreshTokens = new Collection<RefreshTokenEntity>(this);

  @OneToMany(() => CategoryEntity, (category) => category.user)
  categories = new Collection<CategoryEntity>(this);

  @OneToMany(() => TransactionEntity, (transaction) => transaction.user)
  transactions = new Collection<TransactionEntity>(this);

  @Property()
  role: UserRole;

  constructor(
    email: string,
    passwordHash: string,
    role: UserRole = UserRole.USER,
  ) {
    super();

    this.email = email;
    this.passwordHash = passwordHash;
    this.role = role;
  }
}
