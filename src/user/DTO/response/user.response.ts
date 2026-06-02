import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'john.doe@example.com' })
  email!: string;

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
