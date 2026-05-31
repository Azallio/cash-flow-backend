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
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/middlewares/guards/jwt-auth.guard';
import { CategoryService } from './category.service';
import { CreateCategoryRequest } from './DTO/create-category.request';
import { UpdateCategoryRequest } from './DTO/update-catgory.request';

@ApiTags('Categories')
@UseGuards(JwtAuthGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post(':userId')
  create(@Param('userId') userId: number, @Body() dto: CreateCategoryRequest) {
    return this.categoryService.createCategory(dto, userId);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateCategoryRequest) {
    return this.categoryService.updateCategory({ ...dto, id });
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.categoryService.deleteCategory(id);
  }

  @Get(':userId')
  getCategoriesByUserId(@Param('userId') userId: number) {
    return this.categoryService.getCategoriesByUserId(userId);
  }
}
