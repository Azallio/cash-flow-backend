import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryRequest {
  @ApiProperty({
    description: 'Title of the category',
    example: 'Food',
  })
  title: string;

  @ApiProperty({
    description: 'Description of the category',
    example: 'Category for food expenses',
    required: false,
  })
  description?: string;

  constructor(title: string, description?: string) {
    this.title = title;
    this.description = description;
  }
}
