import { PartialType } from '@nestjs/swagger';
import { CreateBudgetRequest } from './create-budget.request';

export class UpdateBudgetRequest extends PartialType(CreateBudgetRequest) {}
