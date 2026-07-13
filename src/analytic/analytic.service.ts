// analytics.service.ts
import { raw } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import Decimal from 'decimal.js';
import { TransactionType } from '../common/enums/transactions-type.enum';
import {
  CategoryBreakdownItem,
  MetricWithChange,
  OverviewResponse,
  TimeSeriesPoint,
} from '../common/interfaces/analytics.interfaces';
import { TransactionEntity } from '../DAL/entities/transaction.entity';
import { Granularity } from './DTO/request/dynamics-query.dto';

interface TypeTotalsRow {
  income: string;
  expense: string;
}

interface TimeSeriesRow {
  bucket: string;
  income: string;
  expense: string;
}

interface CategoryTotalRow {
  categoryId: number;
  categoryName: string;
  total: string;
}

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: EntityRepository<TransactionEntity>,
  ) {}

  // ---------------------------------------------------------------------
  // Public: composed responses for specific dashboard widgets
  // ---------------------------------------------------------------------

  /**
   * Данные для четырёх верхних карточек: Доходы, Расходы, Сбережения, Баланс.
   * Каждая карточка = текущее значение за период + значение за такой же по
   * длине предыдущий период + % изменения между ними.
   */
  public async getOverview(
    userId: number,
    from: Date,
    to: Date,
  ): Promise<OverviewResponse> {
    const { prevFrom, prevTo } = this.getPreviousPeriodRange(from, to);

    const [currentTotals, previousTotals, currentBalance, previousBalance] =
      await Promise.all([
        this.getTypeTotals(userId, from, to),
        this.getTypeTotals(userId, prevFrom, prevTo),
        this.getBalanceAsOf(userId, to),
        this.getBalanceAsOf(userId, prevTo),
      ]);

    const currentSavings = currentTotals.income.minus(currentTotals.expense);
    const previousSavings = previousTotals.income.minus(previousTotals.expense);

    return {
      income: this.toMetricWithChange(
        currentTotals.income,
        previousTotals.income,
      ),
      expense: this.toMetricWithChange(
        currentTotals.expense,
        previousTotals.expense,
      ),
      savings: this.toMetricWithChange(currentSavings, previousSavings),
      balance: this.toMetricWithChange(currentBalance, previousBalance),
    };
  }

  /**
   * Временной ряд для графика "Динамика доходов и расходов".
   * granularity определяет размер бакета (день/неделя/месяц) — вся
   * агрегация происходит в БД через date_trunc, на клиент уходят уже
   * готовые точки.
   */
  public async getDynamics(
    userId: number,
    from: Date,
    to: Date,
    granularity: Granularity,
  ): Promise<TimeSeriesPoint[]> {
    const em =
      this.transactionRepository.getEntityManager() as unknown as EntityManager;

    const bucketExpr = `date_trunc('${granularity}', t.created_at)`;

    const rows = await em
      .createQueryBuilder(TransactionEntity, 't')
      .select([
        raw(`${bucketExpr} as bucket`),
        raw(
          `COALESCE(SUM(CASE WHEN t.transaction_type = '${TransactionType.INCOME}' THEN t.amount ELSE 0 END), 0)::text as income`,
        ),
        raw(
          `COALESCE(SUM(CASE WHEN t.transaction_type = '${TransactionType.EXPENSE}' THEN t.amount ELSE 0 END), 0)::text as expense`,
        ),
      ])
      .where({ user: userId, createdAt: { $gte: from, $lt: to } })
      .groupBy(raw(bucketExpr)) // группируем по тому же raw-выражению, не по алиасу
      .orderBy({ [raw(bucketExpr) as any]: 'ASC' })
      .execute<TimeSeriesRow[]>('all');

    return rows.map((r) => ({
      bucket: new Date(r.bucket).toISOString(),
      income: new Decimal(r.income).toFixed(2),
      expense: new Decimal(r.expense).toFixed(2),
    }));
  }

  /**
   * Разбивка по категориям для донат-чартов ("Расходы по категориям",
   * "Топ категорий расходов"). type по умолчанию EXPENSE — под текущие
   * виджеты дашборда, но параметризуем на случай будущего разреза по INCOME.
   */
  public async getCategoryBreakdown(
    userId: number,
    from: Date,
    to: Date,
    type: TransactionType = TransactionType.EXPENSE,
    limit?: number,
  ): Promise<CategoryBreakdownItem[]> {
    const em =
      this.transactionRepository.getEntityManager() as unknown as EntityManager;

    const qb = em
      .createQueryBuilder(TransactionEntity, 't')
      .select([
        't.category_id as categoryId',
        'c.name as categoryName',
        'SUM(t.amount)::text as total',
      ])
      .join('t.category', 'c')
      .where({
        user: userId,
        transactionType: type,
        createdAt: { $gte: from, $lt: to },
      })
      .groupBy(['t.category_id', 'c.name'])
      .orderBy({ total: 'DESC' });

    if (limit) qb.limit(limit);

    const rows = await qb.execute<CategoryTotalRow[]>('all');

    const grandTotal = rows.reduce(
      (acc, r) => acc.plus(new Decimal(r.total)),
      new Decimal('0'),
    );

    return rows.map((r) => {
      const total = new Decimal(r.total);
      const percent = grandTotal.isZero()
        ? 0
        : total.div(grandTotal).mul(100).toDecimalPlaces(1).toNumber();

      return {
        categoryId: r.categoryId,
        categoryName: r.categoryName,
        total: total.toFixed(2),
        percent,
      };
    });
  }

  // ---------------------------------------------------------------------
  // Private: low-level reusable aggregations
  // ---------------------------------------------------------------------

  /** Сумма доходов и расходов пользователя за период. */
  private async getTypeTotals(
    userId: number,
    from: Date,
    to: Date,
  ): Promise<{ income: Decimal; expense: Decimal }> {
    const em =
      this.transactionRepository.getEntityManager() as unknown as EntityManager;

    const rows = await em
      .createQueryBuilder(TransactionEntity, 't')
      .select([
        raw(
          `COALESCE(SUM(CASE WHEN t.transaction_type = '${TransactionType.INCOME}' THEN t.amount ELSE 0 END), 0)::text as income`,
        ),
        raw(
          `COALESCE(SUM(CASE WHEN t.transaction_type = '${TransactionType.EXPENSE}' THEN t.amount ELSE 0 END), 0)::text as expense`,
        ),
      ])
      .where({ user: userId, createdAt: { $gte: from, $lt: to } })
      .execute<TypeTotalsRow[]>('get');

    const row = Array.isArray(rows) ? rows[0] : rows;
    return {
      income: new Decimal(row?.income ?? '0'),
      expense: new Decimal(row?.expense ?? '0'),
    };
  }

  /**
   * Накопленный баланс пользователя на конец дня asOf: сумма ВСЕХ
   * транзакций с начала учёта (income - expense), а не только за период.
   * Это "остаток на счетах", в отличие от "сбережений за период".
   */
  private async getBalanceAsOf(userId: number, asOf: Date): Promise<Decimal> {
    const em =
      this.transactionRepository.getEntityManager() as unknown as EntityManager;

    const rows = await em
      .createQueryBuilder(TransactionEntity, 't')
      .select(
        raw(
          `COALESCE(SUM(CASE WHEN t.transaction_type = '${TransactionType.INCOME}' THEN t.amount ELSE -t.amount END), 0)::text as balance`,
        ),
      )
      .where({ user: userId, createdAt: { $lt: asOf } })
      .execute<{ balance: string }[]>('get');

    const row = Array.isArray(rows) ? rows[0] : rows;
    return new Decimal(row?.balance ?? '0');
  }

  /**
   * Сдвигает диапазон [from, to) на его же длину назад — для сравнения
   * "текущий период vs такой же по длине предыдущий". Не привязано к
   * календарным месяцам специально: работает для любого произвольного
   * диапазона, который выберет пользователь на фронте.
   */
  private getPreviousPeriodRange(
    from: Date,
    to: Date,
  ): { prevFrom: Date; prevTo: Date } {
    const durationMs = to.getTime() - from.getTime();
    return {
      prevFrom: new Date(from.getTime() - durationMs),
      prevTo: new Date(from.getTime()),
    };
  }

  private toMetricWithChange(
    current: Decimal,
    previous: Decimal,
  ): MetricWithChange {
    return {
      current: current.toFixed(2),
      previous: previous.toFixed(2),
      changePercent: previous.isZero()
        ? null // нельзя посчитать % изменения от нуля — фронт должен показать это как "—" или "новое"
        : current
            .minus(previous)
            .div(previous)
            .mul(100)
            .toDecimalPlaces(1)
            .toNumber(),
    };
  }

  private assertGranularity(value: Granularity): Granularity {
    if (!Object.values(Granularity).includes(value)) {
      throw new Error(`Invalid granularity: ${value}`);
    }
    return value;
  }
}
