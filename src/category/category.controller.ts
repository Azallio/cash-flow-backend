import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/middlewares/guards/jwt-auth.guard';
import { CategoryService } from './category.service';
import { CreateCategoryRequest } from './DTO/create-category.request';
import { UpdateCategoryRequest } from './DTO/update-category.request';

@ApiTags('Categories')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({
    summary: 'Create category for user',
    description: 'Creates a new category and assigns it to a specific user',
  })
  @ApiResponse({
    status: 201,
    description: 'Category successfully created',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid JWT token',
  })
  @Post(':userId')
  create(@Param('userId') userId: number, @Body() dto: CreateCategoryRequest) {
    return this.categoryService.createCategory(dto, userId);
  }

  @ApiOperation({
    summary: 'Update category',
    description: 'Updates category data by ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Category successfully updated',
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
  })
  @Patch(':id')
  public async update(
    @Param('id') id: number,
    @Body() dto: UpdateCategoryRequest,
  ) {
    return await this.categoryService.updateCategory({
      ...dto,
      id,
    });
  }

  @ApiOperation({
    summary: 'Delete category',
    description: 'Deletes category by ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Category successfully deleted',
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
  })
  @Delete(':id')
  public async remove(@Param('id') id: number) {
    return await this.categoryService.removeCategory(id);
  }

  @ApiOperation({
    summary: 'Get categories by user ID',
    description: 'Returns all categories belonging to a specific user',
  })
  @ApiResponse({
    status: 200,
    description: 'List of categories',
  })
  @ApiNotFoundResponse({
    description: 'User not found or has no categories',
  })
  @Get(':userId')
  public async getCategoriesByUserId(@Param('userId') userId: number) {
    return await this.categoryService.getCategoriesByUserId(userId);
  }
}
