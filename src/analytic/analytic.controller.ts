import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiOkResponseWrapped } from '../common/DTO/apiResponse';
import { GetUser } from '../common/middlewares/decorators/user/getUser';
import { JwtAuthGuard } from '../common/middlewares/guards/jwt-auth.guard';
import { AnalyticService } from './analytic.service';
import { AnalyticByCategoryRequest } from './DTO/request/analytic-by-category.request';
import { GeneralAnalyticRequest } from './DTO/request/general-analytic.request';
import { AnalyticByCategoryResponse } from './DTO/response/analytic-by-category.response';
import { AnalyticByTopCategoriesResponse } from './DTO/response/analytic-by-top-categories.response';
import { GeneralAnalyticResponse } from './DTO/response/general-analytic.response';

@ApiTags('Analytics')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticController {
  constructor(private readonly analyticService: AnalyticService) {}

  @Get()
  @ApiOperation({
    summary: 'Get general user analytics',
    description:
      'Returns analytics for the current day, month, year, or all time if period is omitted',
  })
  @ApiOkResponseWrapped(GeneralAnalyticResponse, {
    description: 'General analytics successfully returned',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  public async getUserGeneralAnalytics(
    @GetUser('userId') userId: number,
    @Query() query: GeneralAnalyticRequest,
  ): Promise<GeneralAnalyticResponse> {
    return this.analyticService.getUserGeneralAnalytics(userId, query);
  }

  @Get('category')
  @ApiOperation({
    summary: 'Get analytics grouped by category',
    description: 'Returns statistics grouped by transaction categories',
  })
  @ApiOkResponseWrapped(AnalyticByCategoryResponse, {
    description: 'Category analytics successfully returned',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  public async getUserCategoryAnalytics(
    @GetUser('userId') userId: number,
    @Query() query: AnalyticByCategoryRequest,
  ): Promise<AnalyticByCategoryResponse> {
    return this.analyticService.getUserCategoryAnalytics(userId, query);
  }

  @Get('top-categories')
  @ApiOperation({
    summary: 'Get top categories by transaction amount',
    description: 'Returns the top categories based on transaction amounts',
  })
  @ApiOkResponseWrapped(AnalyticByCategoryResponse, {
    description: 'Top categories successfully returned',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  public async getTopTenCategories(
    @GetUser('userId') userId: number,
  ): Promise<AnalyticByTopCategoriesResponse> {
    return await this.analyticService.getTopTenCategories(userId);
  }
}
