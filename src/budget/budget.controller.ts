import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiOkResponseWrapped } from '../common/DTO/apiResponse';
import { GetUser } from '../common/middlewares/decorators/user/getUser';
import { JwtAuthGuard } from '../common/middlewares/guards/jwt-auth.guard';
import { BudgetService } from './budget.service';
import { CreateBudgetRequest } from './DTO/request/create-budget.request';
import { UpdateBudgetRequest } from './DTO/request/update-budget.request';
import { CreateBudgetResponse } from './DTO/response/create-budget.response';

@ApiTags('Budget')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @ApiOperation({
    summary: 'Create a new budget',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiOkResponseWrapped(CreateBudgetResponse, {
    description: 'Budget successfully created',
  })
  @Post()
  public async create(
    @GetUser('userId') userId: number,
    @Body() createBudgetRequest: CreateBudgetRequest,
  ): Promise<CreateBudgetResponse> {
    const budget = await this.budgetService.create(createBudgetRequest, userId);
    return new CreateBudgetResponse(
      budget.id,
      budget.title,
      budget.targetAmount,
      budget.collectedAmount,
      budget.description,
    );
  }

  @ApiOperation({
    summary: 'Get all budgets',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiOkResponseWrapped(CreateBudgetResponse, {
    description: 'Budgets successfully retrieved',
  })
  @Get()
  public async findAll(
    @GetUser('userId') userId: number,
  ): Promise<CreateBudgetResponse[]> {
    return this.budgetService.findAll(userId);
  }

  @ApiOperation({
    summary: 'Get a budget by ID',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiOkResponseWrapped(CreateBudgetResponse, {
    description: 'Budget successfully retrieved',
  })
  @Get(':id')
  public async findOne(@Param('id') id: string) {
    return this.budgetService.findOne(+id);
  }

  @ApiOperation({
    summary: 'Update a budget by ID',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiOkResponseWrapped(CreateBudgetResponse, {
    description: 'Budget successfully updated',
  })
  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateBudgetRequest: UpdateBudgetRequest,
  ) {
    return this.budgetService.update(+id, updateBudgetRequest);
  }

  @ApiOperation({
    summary: 'Delete a budget by ID',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @Delete(':id')
  public async remove(@Param('id') id: string) {
    return this.budgetService.remove(+id);
  }
}
