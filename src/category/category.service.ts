import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PagingArrayResponse } from '../common/DTO/pagingArrayResponse';
import { PagingQueryRequest } from '../common/DTO/pagingQueryRequest';
import { CategoryEntity } from '../DAL/entities/category.entity';
import { UserService } from '../user/user.service';
import { CreateCategoryRequest } from './DTO/request/create-category.request';
import { UpdateCategoryRequest } from './DTO/request/update-category.request';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: EntityRepository<CategoryEntity>,
    private readonly userService: UserService,
  ) {}

  public async createCategory(
    dto: CreateCategoryRequest,
    userId: number,
  ): Promise<CategoryEntity> {
    const user = await this.userService.getUserById(userId);

    const newCategory = new CategoryEntity(
      user,
      dto.title,
      dto.transactionType,
      dto.description,
    );

    await this.categoryRepository
      .getEntityManager()
      .persist(newCategory)
      .flush();

    return newCategory;
  }

  public async getCategoriesByUserId(
    userId: number,
    paging: PagingQueryRequest,
  ): Promise<PagingArrayResponse<CategoryEntity>> {
    const [items, totalItems] = await this.categoryRepository.findAndCount(
      { user: { id: userId } },
      {
        offset: paging.skip,
        limit: paging.take,
        orderBy: { createdAt: 'desc' },
      },
    );

    return new PagingArrayResponse(items, totalItems);
  }

  public async getCategoryById(
    id: number,
    userId?: number,
  ): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne(
      userId == null ? { id } : { id, user: { id: userId } },
    );

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  public async removeCategory(id: number, userId: number) {
    const category = await this.categoryRepository.findOne({
      id,
      user: { id: userId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.categoryRepository.getEntityManager().remove(category).flush();
  }

  public async updateCategory(
    dto: UpdateCategoryRequest,
    userId: number,
  ): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      id: dto.id,
      user: { id: userId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (dto.title) {
      category.title = dto.title;
    }
    if (dto.description) {
      category.description = dto.description;
    }
    if (dto.transactionType) {
      category.transactionType = dto.transactionType;
    }
    await this.categoryRepository.getEntityManager().persist(category).flush();
    return category;
  }
}
