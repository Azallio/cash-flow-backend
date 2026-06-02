import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import {
  ConflictException,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { PagingArrayResponse } from '../common/DTO/pagingArrayResponse';
import { PagingQueryRequest } from '../common/DTO/pagingQueryRequest';
import { UserEntity } from '../DAL/entities/user.entity';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: EntityRepository<UserEntity>,
  ) {}

  public async findByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  public async getUserById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  public async createUser(email: string, password: string) {
    const existingUser = await this.userRepository.findOne({ email });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const newUser = new UserEntity(email, password);

    const em = this.userRepository.getEntityManager();
    await em.persist(newUser).flush();
    return newUser;
  }

  public async deleteUser(id: number) {
    const user = await this.userRepository.findOne({ id });
    if (user == null) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.getEntityManager().remove(user).flush();
  }

  public async findAll(
    paging: PagingQueryRequest,
  ): Promise<PagingArrayResponse<UserEntity>> {
    const [items, totalItems] = await this.userRepository.findAndCount(
      {},
      {
        offset: paging.skip,
        limit: paging.take,
        orderBy: { createdAt: 'desc' },
      },
    );

    return new PagingArrayResponse(items, totalItems);
  }
}
