import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, FilterQuery } from '@mikro-orm/postgresql';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PagingArrayResponse } from '../common/DTO/pagingArrayResponse';
import { PagingQueryRequest } from '../common/DTO/pagingQueryRequest';
import { BudgetEntity } from '../DAL/entities/budget.entity';
import { CategoryEntity } from '../DAL/entities/category.entity';
import { TransactionEntity } from '../DAL/entities/transaction.entity';
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
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  public async removeCategory(id: number, userId: number): Promise<void> {
    const em = this.categoryRepository.getEntityManager();

    // §4.2 Service-level budget guard (DB RESTRICT is second layer)
    const activeBudgetsCount = await em.count(BudgetEntity, {
      category: { id },
      isActive: true,
    });
    if (activeBudgetsCount > 0) {
      throw new ConflictException(
        'Category has active budgets. Freeze or remove all budgets before deleting this category.',
      );
    }

    await em.transactional(async (em) => {
      const category = await em.findOne(CategoryEntity, {
        id,
        user: { id: userId },
      });
      if (!category) throw new NotFoundException('Category not found');

      let otherCategory = await em.findOne(CategoryEntity, {
        user: { id: userId },
        title: 'Other',
        transactionType: category.transactionType,
      });

      if (!otherCategory) {
        const user = await this.userService.getUserById(userId);
        otherCategory = new CategoryEntity(
          user,
          'Other',
          category.transactionType,
          'System category',
        );
        em.persist(otherCategory);
        await em.flush();
      }

      await em.nativeUpdate(
        TransactionEntity,
        { category: category.id, user: userId },
        { category: otherCategory.id },
      );

      em.remove(category);
    });
  }

  public async updateCategory(
    dto: UpdateCategoryRequest,
    userId: number,
  ): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      id: dto.id,
      user: { id: userId },
    });
    if (!category) throw new NotFoundException('Category not found');

    if (dto.title) category.title = dto.title;
    if (dto.description) category.description = dto.description;
    if (dto.transactionType) category.transactionType = dto.transactionType;

    await this.categoryRepository.getEntityManager().persist(category).flush();
    return category;
  }

  public async findManyByUserId(
    userId: number,
    where: FilterQuery<CategoryEntity>,
  ): Promise<Array<CategoryEntity>> {
    const filter: FilterQuery<CategoryEntity> = {
      $and: [where, { user: { id: userId } }],
    };
    return await this.categoryRepository.find(
      { ...filter },
      { populate: ['transactions'] },
    );
  }
}
