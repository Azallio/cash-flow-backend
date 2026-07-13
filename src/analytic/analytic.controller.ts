// analytics.controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TransactionType } from '../common/enums/transactions-type.enum';
import { GetUser } from '../common/middlewares/decorators/user/getUser';
import { JwtAuthGuard } from '../common/middlewares/guards/jwt-auth.guard';
import { AnalyticsPeriodDto } from './DTO/request/analytics-period.dto';
import { CategoryBreakdownQueryDto } from './DTO/request/category-breakdown-query.dto';
import { DynamicsQueryDto } from './DTO/request/dynamics-query.dto';
import { CategoryBreakdownItemResponse } from './DTO/response/category-breakdown-item.response';
import { OverviewResponse } from './DTO/response/overview.response';
import { TimeSeriesPointResponse } from './DTO/response/time-series-point.response';
import { AnalyticsService } from './analytic.service';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  @ApiOperation({
    summary: 'Сводка по дашборду',
    description:
      'Доходы, расходы, сбережения и баланс за период с сравнением к предыдущему периоду такой же длины. Используется для 4 верхних карточек дашборда.',
  })
  @ApiOkResponse({ type: OverviewResponse })
  async overview(
    @GetUser('userId') userId: number,
    @Query() query: AnalyticsPeriodDto,
  ): Promise<OverviewResponse> {
    const { from, to } = this.resolvePeriod(query);
    return this.analyticsService.getOverview(userId, from, to);
  }

  @Get('dynamics')
  @ApiOperation({
    summary: 'Динамика доходов и расходов',
    description:
      'Временной ряд сумм доходов/расходов, сгруппированный по дню/неделе/месяцу. Источник данных для линейного графика.',
  })
  @ApiOkResponse({ type: TimeSeriesPointResponse, isArray: true })
  async dynamics(
    @GetUser('userId') userId: number,
    @Query() query: DynamicsQueryDto,
  ): Promise<TimeSeriesPointResponse[]> {
    const { from, to } = this.resolvePeriod(query);
    return this.analyticsService.getDynamics(
      userId,
      from,
      to,
      query.granularity,
    );
  }

  @Get('categories')
  @ApiOperation({
    summary: 'Расходы по категориям',
    description:
      'Разбивка расходов по всем категориям за период с процентной долей каждой. Источник данных для donut-чарта "Расходы по категориям".',
  })
  @ApiOkResponse({ type: CategoryBreakdownItemResponse, isArray: true })
  async categories(
    @GetUser('userId') userId: number,
    @Query() query: CategoryBreakdownQueryDto,
  ): Promise<CategoryBreakdownItemResponse[]> {
    const { from, to } = this.resolvePeriod(query);
    return this.analyticsService.getCategoryBreakdown(
      userId,
      from,
      to,
      TransactionType.EXPENSE,
      query.limit,
    );
  }

  @Get('top-categories')
  @ApiOperation({
    summary: 'Топ категорий расходов',
    description:
      'То же самое, что /categories, но с дефолтным лимитом в 6 категорий — под виджет "Топ категорий расходов" на дашборде.',
  })
  @ApiOkResponse({ type: CategoryBreakdownItemResponse, isArray: true })
  async topCategories(
    @GetUser('userId') userId: number,
    @Query() query: CategoryBreakdownQueryDto,
  ): Promise<CategoryBreakdownItemResponse[]> {
    const { from, to } = this.resolvePeriod(query);
    return this.analyticsService.getCategoryBreakdown(
      userId,
      from,
      to,
      TransactionType.EXPENSE,
      query.limit ?? 6,
    );
  }

  private resolvePeriod(query: AnalyticsPeriodDto): { from: Date; to: Date } {
    if (query.from && query.to) {
      return { from: new Date(query.from), to: new Date(query.to) };
    }
    const now = new Date();
    const from = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const to = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1),
    );
    return { from, to };
  }
}
