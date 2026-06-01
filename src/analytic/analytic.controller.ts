import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetUser } from '../common/middlewares/decorators/user/getUser';
import { JwtAuthGuard } from '../common/middlewares/guards/jwt-auth.guard';
import { AnalyticService } from './analytic.service';
import { AnalyticByCategoryRequest } from './DTO/request/analytic-by-category.request';
import { GeneralAnalyticRequest } from './DTO/request/general-analytic.request';
import { MonthlyAnalyticRequest } from './DTO/request/monthly-analytic.request';
import { YearlyAnalyticRequest } from './DTO/request/yearly-analytic.request';
import { AnalyticByCategoryResponse } from './DTO/response/analytic-by-category.response';
import { GeneralAnalyticResponse } from './DTO/response/general-analytic.response';
import { MonthlyAnalyticResponse } from './DTO/response/monthly-analytic.response';
import { YearlyAnalyticResponse } from './DTO/response/yearly-analytic.response';

@ApiTags('Analytics')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticController {
  constructor(private readonly analyticService: AnalyticService) {}

  @Get('general')
  @ApiOperation({
    summary: 'Get general user analytics',
    description: 'Returns total income and expenses for the selected period',
  })
  @ApiOkResponse({
    type: GeneralAnalyticResponse,
    description: 'General analytics successfully returned',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  public async getUserGeneralAnalytics(
    @GetUser('id') userId: number,
    @Query() query: GeneralAnalyticRequest,
  ): Promise<GeneralAnalyticResponse> {
    return this.analyticService.getUserGeneralAnalytics(userId, query);
  }

  @Get('category')
  @ApiOperation({
    summary: 'Get analytics grouped by category',
    description: 'Returns statistics grouped by transaction categories',
  })
  @ApiOkResponse({
    type: AnalyticByCategoryResponse,
    description: 'Category analytics successfully returned',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  public async getUserCategoryAnalytics(
    @GetUser('id') userId: number,
    @Query() query: AnalyticByCategoryRequest,
  ): Promise<AnalyticByCategoryResponse> {
    return this.analyticService.getUserCategoryAnalytics(userId, query);
  }

  @Get('monthly')
  @ApiOperation({
    summary: 'Get monthly analytics',
    description: 'Returns analytics for a specific month',
  })
  @ApiOkResponse({
    type: MonthlyAnalyticResponse,
    description: 'Monthly analytics successfully returned',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  public async getUserMonthlyAnalytics(
    @GetUser('id') userId: number,
    @Query() query: MonthlyAnalyticRequest,
  ): Promise<MonthlyAnalyticResponse> {
    return this.analyticService.getUserMonthlyAnalytics(userId, query);
  }

  @Get('yearly')
  @ApiOperation({
    summary: 'Get yearly analytics',
    description: 'Returns analytics for a specific year',
  })
  @ApiOkResponse({
    type: YearlyAnalyticResponse,
    description: 'Yearly analytics successfully returned',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  public async getUserYearlyAnalytics(
    @GetUser('id') userId: number,
    @Query() query: YearlyAnalyticRequest,
  ): Promise<YearlyAnalyticResponse> {
    return this.analyticService.getUserYearlyAnalytics(userId, query);
  }
}
