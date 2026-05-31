import { ApiProperty } from '@nestjs/swagger';

export class CreateUserResponse {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  constructor(id: number, email: string) {
    this.id = id;
    this.email = email;
  }
}
