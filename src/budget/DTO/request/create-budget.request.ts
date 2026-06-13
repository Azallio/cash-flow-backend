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

  @ApiProperty({
    description: 'Start period of the budget',
    example: '2024-01-01',
    required: false,
  })
  @IsOptional()
  startPeriod: Date;

  @ApiProperty({
    description: 'End period of the budget',
    example: '2024-12-31',
    required: false,
  })
  @IsOptional()
  endPeriod: Date;

  constructor(
    title: string,
    targetAmount: number,
    collectedAmount: number,
    startPeriod: Date,
    endPeriod: Date,
    description?: string,
  ) {
    this.title = title;
    this.targetAmount = targetAmount;
    this.collectedAmount = collectedAmount;
    this.startPeriod = startPeriod;
    this.endPeriod = endPeriod;
    this.description = description;
  }
}
