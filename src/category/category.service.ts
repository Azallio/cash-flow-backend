import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
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

    const newCategory = new CategoryEntity(user, dto.title, dto.description);

    await this.categoryRepository
      .getEntityManager()
      .persist(newCategory)
      .flush();

    return newCategory;
  }

  public async getCategoriesByUserId(
    userId: number,
  ): Promise<CategoryEntity[]> {
    const user = await this.userService.getUserById(userId);
    return this.categoryRepository.find({ user });
  }

  public async getCategoryById(id: number): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({ id });
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  public async removeCategory(id: number) {
    const category = await this.categoryRepository.findOne({ id });
    if (!category) {
      throw new Error('Category not found');
    }
    await this.categoryRepository.getEntityManager().remove(category).flush();
  }

  public async updateCategory(
    dto: UpdateCategoryRequest,
  ): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({ id: dto.id });
    if (!category) {
      throw new Error('Category not found');
    }
    if (dto.title) {
      category.title = dto.title;
    }
    if (dto.description) {
      category.description = dto.description;
    }
    await this.categoryRepository.getEntityManager().persist(category).flush();
    return category;
  }
}
