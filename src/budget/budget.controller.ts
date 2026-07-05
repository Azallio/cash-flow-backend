import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  ApiOkResponseWrapped,
  ApiOkResponseWrappedNoData,
} from '../common/DTO/apiResponse';
import { GetUser } from '../common/middlewares/decorators/user/getUser';
import { JwtAuthGuard } from '../common/middlewares/guards/jwt-auth.guard';
import { BudgetGenerationService } from './budget-generation.service';
import { BudgetPlanService } from './budget-plan.service';
import { BudgetService } from './budget.service';
import { ExtendBudgetRequest } from './DTO/request/extend-budget.request';
import { FreezeReallocateRequest } from './DTO/request/freeze-reallocate.request';
import { CategoryBudgetResponse } from './DTO/response/category-budget.response';
import { MonthlyPlanResponse } from './DTO/response/monthly-plan.response';

@ApiTags('Budget')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('budget')
export class BudgetController {
  constructor(
    private readonly budgetService: BudgetService,
    private readonly budgetPlanService: BudgetPlanService,
    private readonly budgetGenerationService: BudgetGenerationService,
  ) {}

  @Get('category/:categoryId')
  @ApiOperation({
    summary: 'Get current month budget for a category',
    description:
      'Returns the active MONTHLY budget with computed collectedAmount and remaining',
  })
  @ApiOkResponseWrapped(CategoryBudgetResponse, { description: 'Budget data' })
  @ApiNotFoundResponse({ description: 'Category or budget not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Category is not EXPENSE type' })
  public async getCategoryBudget(
    @GetUser('userId') userId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<CategoryBudgetResponse> {
    return this.budgetService.getCategoryCurrentBudget(categoryId, userId);
  }

  @Get('plan/current')
  @ApiOperation({
    summary: 'Get current month plan with calculations',
    description:
      'Returns projectedIncome, totalAllocated, available for the current month',
  })
  @ApiOkResponseWrapped(MonthlyPlanResponse, { description: 'Monthly plan' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public async getCurrentPlan(
    @GetUser('userId') userId: number,
  ): Promise<MonthlyPlanResponse> {
    const now = new Date();
    const month = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
    );
    return this.budgetPlanService.getPlanWithCalculations(userId, month);
  }

  @Patch(':id/freeze')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Freeze a budget (set isActive = false)' })
  @ApiOkResponseWrappedNoData('Budget frozen successfully')
  @ApiNotFoundResponse({ description: 'Budget not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public async freeze(
    @GetUser('userId') userId: number,
    @Param('id', ParseIntPipe) budgetId: number,
  ): Promise<void> {
    return this.budgetService.freezeBudget(budgetId, userId);
  }

  @Patch(':id/unfreeze')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Unfreeze a budget (set isActive = true)',
    description:
      'Negative available is allowed and surfaced as a warning to the user',
  })
  @ApiOkResponseWrappedNoData('Budget unfrozen successfully')
  @ApiNotFoundResponse({ description: 'Budget not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public async unfreeze(
    @GetUser('userId') userId: number,
    @Param('id', ParseIntPipe) budgetId: number,
  ): Promise<void> {
    return this.budgetService.unfreezeBudget(budgetId, userId);
  }

  @Post(':id/extend')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Extend a budget limit' })
  @ApiOkResponseWrappedNoData('Budget extended successfully')
  @ApiNotFoundResponse({ description: 'Budget not found' })
  @ApiBadRequestResponse({
    description: 'Reallocation would exceed source budget spend',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public async extend(
    @GetUser('userId') userId: number,
    @Param('id', ParseIntPipe) budgetId: number,
    @Body() dto: ExtendBudgetRequest,
  ): Promise<void> {
    dto.targetBudgetId = budgetId;
    return this.budgetService.extendBudget(dto, userId);
  }

  @Post('freeze-reallocate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Freeze a budget and reallocate its limit to another',
  })
  @ApiOkResponseWrappedNoData('Freeze-reallocate completed successfully')
  @ApiNotFoundResponse({ description: 'Budget not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public async freezeAndReallocate(
    @GetUser('userId') userId: number,
    @Body() dto: FreezeReallocateRequest,
  ): Promise<void> {
    return this.budgetService.freezeAndReallocate(
      dto.fromBudgetId,
      dto.toBudgetId,
      userId,
    );
  }

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Trigger monthly budget generation',
    description:
      'Lazily generates MONTHLY budgets for all EXPENSE categories of the user for the current month',
  })
  @ApiOkResponseWrappedNoData('Generation triggered successfully')
  @ApiConflictResponse({
    description: 'Budgets already exist for current month',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public async generate(@GetUser('userId') userId: number): Promise<void> {
    const now = new Date();
    const month = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
    );
    return this.budgetGenerationService.generateForUserAndMonth(userId, month);
  }
}
