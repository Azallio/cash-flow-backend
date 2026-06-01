import { PartialType } from '@nestjs/swagger';
import { CreateCategoryRequest } from './create-category.request';

export class UpdateCategoryRequest extends PartialType(CreateCategoryRequest) {
  id: number;

  constructor(userId: number, title?: string, description?: string) {
    super(title, description);

    this.id = userId;
  }
}
