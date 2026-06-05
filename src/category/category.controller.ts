import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  ApiCreatedResponseWrapped,
  ApiOkResponseWrapped,
  ApiOkResponseWrappedNoData,
  ApiOkResponseWrappedPagingArray,
} from '../common/DTO/apiResponse';
import { PagingQueryRequest } from '../common/DTO/pagingQueryRequest';
import { GetUser } from '../common/middlewares/decorators/user/getUser';
import { JwtAuthGuard } from '../common/middlewares/guards/jwt-auth.guard';
import { CategoryService } from './category.service';
import { CreateCategoryRequest } from './DTO/request/create-category.request';
import { UpdateCategoryRequest } from './DTO/request/update-category.request';
import { CategoryResponse } from './DTO/response/category.response';

@ApiTags('Categories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({
    summary: 'Create category for user',
    description: 'Creates a new category and assigns it to a specific user',
  })
  @ApiCreatedResponseWrapped(CategoryResponse, {
    description: 'Category successfully created',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid JWT token',
  })
  @Post()
  public async create(
    @GetUser('userId') userId: number,
    @Body() dto: CreateCategoryRequest,
  ) {
    return this.categoryService.createCategory(dto, userId);
  }

  @ApiOperation({
    summary: 'Update category',
    description: 'Updates category data by ID',
  })
  @ApiOkResponseWrapped(CategoryResponse, {
    description: 'Category successfully updated',
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
  })
  @Patch(':id')
  public async update(
    @GetUser('userId') userId: number,
    @Param('id') id: number,
    @Body() dto: UpdateCategoryRequest,
  ) {
    return await this.categoryService.updateCategory(
      {
        ...dto,
        id,
      },
      userId,
    );
  }

  @ApiOperation({
    summary: 'Delete category',
    description: 'Deletes category by ID',
  })
  @ApiOkResponseWrappedNoData('Category successfully deleted')
  @ApiNotFoundResponse({
    description: 'Category not found',
  })
  @Delete(':id')
  public async remove(
    @GetUser('userId') userId: number,
    @Param('id') id: number,
  ) {
    return await this.categoryService.removeCategory(id, userId);
  }

  @ApiOperation({
    summary: 'Get categories for the authenticated user',
    description: 'Returns all categories belonging to the authenticated user',
  })
  @ApiOkResponseWrappedPagingArray(CategoryResponse, 'List of categories')
  @ApiNotFoundResponse({
    description: 'User not found or has no categories',
  })
  @Get()
  public async get(
    @GetUser('userId') userId: number,
    @Query() paging: PagingQueryRequest,
  ) {
    return await this.categoryService.getCategoriesByUserId(userId, paging);
  }

  @ApiOperation({
    summary: 'Get category by ID',
    description: 'Returns a category by ID for the authenticated user',
  })
  @ApiOkResponseWrapped(CategoryResponse, {
    description: 'Category successfully retrieved',
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid JWT token',
  })
  @Get(':id')
  public async getById(
    @GetUser('userId') userId: number,
    @Param('id') id: string,
  ) {
    return await this.categoryService.getCategoryById(+id, userId);
  }
}
