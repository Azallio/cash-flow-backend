import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryResponse {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Food' })
  title!: string;

  @ApiPropertyOptional({
    example: 'Category for food expenses',
    nullable: true,
  })
  description?: string;

  @ApiProperty({
    example: '2026-06-02T10:00:00.000Z',
    format: 'date-time',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2026-06-02T10:00:00.000Z',
    format: 'date-time',
  })
  updatedAt!: Date;
}
