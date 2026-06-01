import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryRequest {
  @ApiProperty({
    description: 'Title of the category',
    example: 'Food',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
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
