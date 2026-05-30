import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { UserEntity } from '../DAL/entities/user.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { ConfigService } from '../configuration/config.service';
import { InjectRepository } from '@mikro-orm/nestjs';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(UserEntity)
    private readonly userRepository: EntityRepository<UserEntity>,
  ) {}

  public async createUser(name: string) {
    const user = new UserEntity(name);

    const em = this.userRepository.getEntityManager();
    await em.persistAndFlush(user);
  }

  public async updateUserName(id: number, name: string) {
    const user = await this.userRepository.findOne({ id });
    if (user == null) {
      throw new NotFoundException('User not found');
    }

    user.name = name;

    const em = this.userRepository.getEntityManager();
    await em.flush();
  }
}
