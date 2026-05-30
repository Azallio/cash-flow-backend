import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { UserEntity } from '../DAL/entities/user.entity';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: EntityRepository<UserEntity>,
  ) {}

  public async createUser(email: string, passwordHash: string) {
    const user = new UserEntity(email, passwordHash);

    const em = this.userRepository.getEntityManager();
    await em.persistAndFlush(user);
  }

  public async updateUserEmail(id: number, email: string) {
    const user = await this.userRepository.findOne({ id });
    if (user == null) {
      throw new NotFoundException('User not found');
    }

    user.email = email;

    const em = this.userRepository.getEntityManager();
    await em.flush();
  }
}
