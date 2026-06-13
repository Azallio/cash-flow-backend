import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBudgetRequest {
  @ApiProperty({
    description: 'Title of the budget',
    example: 'Vacation Fund',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Target amount for the budget',
    example: 1000,
  })
  @IsNotEmpty()
  @IsNumber()
  targetAmount: number;

  @ApiProperty({
    description: 'Amount collected so far',
    example: 200,
  })
  @IsNotEmpty()
  @IsNumber()
  collectedAmount: number;

  @ApiProperty({
    description: 'Description of the budget',
    example: 'This budget is for our upcoming vacation.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  constructor(
    title: string,
    targetAmount: number,
    collectedAmount: number,
    description?: string,
  ) {
    this.title = title;
    this.targetAmount = targetAmount;
    this.collectedAmount = collectedAmount;
    this.description = description;
  }
}
