import { PartialType } from '@nestjs/swagger';
import { CreateBudgetDto } from './create-budget.request';

export class UpdateBudgetDto extends PartialType(CreateBudgetDto) {}
