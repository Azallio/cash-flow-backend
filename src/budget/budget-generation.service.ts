import { raw } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import Decimal from 'decimal.js';
import { BudgetPeriod } from '../common/enums/budget-period.enum';
import { TransactionType } from '../common/enums/transactions-type.enum';
import { BudgetEntity } from '../DAL/entities/budget.entity';
import { CategoryEntity } from '../DAL/entities/category.entity';
import { TransactionEntity } from '../DAL/entities/transaction.entity';
import { BudgetPlanService } from './budget-plan.service';

/**
 * Fraction of monthly income always reserved for savings and never budgeted.
 * e.g. 0.10 = 10% of income is "off-limits" for expense categories.
 *
 * TODO: make this configurable per-user when user preferences are introduced.
 */
const SAVINGS_RESERVE_RATE = new Decimal('0.10');

/**
 * Affordability ratio used when no INCOME transactions exist for the previous
 * month. We cannot assess how much the user can afford, so we apply a
 * conservative flat cut to whatever they spent.
 *
 * TODO: make this configurable per-user when user preferences are introduced.
 */
const NO_INCOME_DATA_FALLBACK_RATE = new Decimal('0.90');

@Injectable()
export class BudgetGenerationService {
  private readonly logger = new Logger(BudgetGenerationService.name);

  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: EntityRepository<CategoryEntity>,
    @InjectRepository(BudgetEntity)
    private readonly budgetRepository: EntityRepository<BudgetEntity>,
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: EntityRepository<TransactionEntity>,
    private readonly budgetPlanService: BudgetPlanService,
  ) {}

  /**
   * Generates MONTHLY budgets for all EXPENSE categories of a user
   * that don't yet have one for the given month.
   * Safe to call multiple times (idempotent per category+month).
   *
   * The whole operation runs inside a single DB transaction so that a failure
   * mid-way never leaves the user with a partial set of budgets.
   */
  public async generateForUserAndMonth(
    userId: number,
    month: Date,
  ): Promise<void> {
    const normalizedMonth = this.normalizeToFirstOfMonth(month);
    const previousMonth = new Date(
      Date.UTC(
        normalizedMonth.getUTCFullYear(),
        normalizedMonth.getUTCMonth() - 1,
        1,
      ),
    );

    const em =
      this.budgetRepository.getEntityManager() as unknown as EntityManager;

    await em
      .transactional(async (txEm) => {
        const categories = await txEm.getRepository(CategoryEntity).find({
          user: { id: userId },
          transactionType: TransactionType.EXPENSE,
        });

        if (categories.length === 0) return;

        const categoryIds = categories.map((c) => c.id);

        // One query to find all budgets that already exist for this user+month.
        const existingBudgets = await txEm.getRepository(BudgetEntity).find({
          category: { $in: categoryIds },
          period: BudgetPeriod.MONTHLY,
          month: normalizedMonth,
        });
        const existingCategoryIds = new Set(
          existingBudgets.map((b) => b.category.id),
        );

        const missingCategories = categories.filter(
          (c) => !existingCategoryIds.has(c.id),
        );
        if (missingCategories.length === 0) return;

        // Calculate affordable limits for every category (even those that
        // already have budgets — the Map is also used for other purposes).
        const limits = await this.calculateAffordableLimits(
          userId,
          categoryIds,
          previousMonth,
          txEm,
        );

        for (const category of missingCategories) {
          const limitAmount = limits.get(category.id) ?? '0.00';
          const budget = new BudgetEntity(
            category,
            BudgetPeriod.MONTHLY,
            limitAmount,
            normalizedMonth,
            undefined,
            undefined,
            true,
          );
          txEm.persist(budget);
        }

        // Flush inside the transaction; unique-violation (23505) is caught below.
        await txEm.flush();

        // Ensure a MonthlyBudgetPlan exists for this user+month.
        await this.budgetPlanService.getOrCreatePlan(
          userId,
          normalizedMonth,
          txEm,
        );
      })
      .catch((err: unknown) => {
        // Postgres unique_violation: a concurrent call already created budgets
        // for this user+month. This is expected and harmless — silently skip.
        if (
          typeof err === 'object' &&
          err !== null &&
          (err as { code?: string }).code === '23505'
        ) {
          this.logger.warn(
            `Duplicate budget creation skipped for userId=${userId} month=${normalizedMonth.toISOString()} (concurrent call)`,
          );
          return;
        }
        throw err;
      });
  }

  /**
   * Calculates the recommended monthly limit for each EXPENSE category,
   * taking into account the user's overall affordability for that month.
   *
   * The core idea:
   *   - We know how much was actually spent in each category last month
   *     (`spendByCategory`).
   *   - We know the total income for that month (`totalIncome`).
   *   - We reserve `SAVINGS_RESERVE_RATE` of income for savings, leaving
   *     `affordableTotal = totalIncome * (1 - SAVINGS_RESERVE_RATE)` for
   *     all expenses combined.
   *   - `affordabilityRatio = min(1, affordableTotal / totalExpense)`:
   *       * ratio = 1  → the user earned enough; last month's spend is a
   *                       fine baseline for each category's limit.
   *       * ratio < 1 → the user overspent relative to income; every
   *                       category limit is scaled down proportionally so
   *                       the sum of all limits fits within `affordableTotal`,
   *                       preserving the relative priorities between categories.
   *   - If no income transactions exist we cannot evaluate affordability, so
   *     we fall back to `NO_INCOME_DATA_FALLBACK_RATE`.
   *
   * @param userId         - owner of the categories
   * @param categoryIds    - EXPENSE category IDs to compute limits for
   * @param previousMonth  - first day of the reference month (UTC)
   * @param em             - optional EntityManager (e.g. from an outer transaction)
   * @returns Map<categoryId, limitAmount as decimal string "0.00">
   */
  public async calculateAffordableLimits(
    userId: number,
    categoryIds: number[],
    previousMonth: Date,
    em?: EntityManager,
  ): Promise<Map<number, string>> {
    if (categoryIds.length === 0) return new Map();

    const firstDay = new Date(
      Date.UTC(previousMonth.getUTCFullYear(), previousMonth.getUTCMonth(), 1),
    );
    const lastDay = new Date(
      Date.UTC(
        previousMonth.getUTCFullYear(),
        previousMonth.getUTCMonth() + 1,
        1,
      ),
    );

    const [totalIncome, spendRows] = await Promise.all([
      this.fetchTotalIncome(userId, firstDay, lastDay, em),
      this.fetchExpenseByCategory(userId, categoryIds, firstDay, lastDay, em),
    ]);

    const spendByCategory = new Map<number, Decimal>(
      spendRows.map(({ categoryId, total }) => [
        categoryId,
        new Decimal(total),
      ]),
    );

    // Ensure every requested category is present in the map (even with 0).
    for (const id of categoryIds) {
      if (!spendByCategory.has(id)) {
        spendByCategory.set(id, new Decimal('0'));
      }
    }

    const totalExpense = [...spendByCategory.values()].reduce(
      (acc, v) => acc.plus(v),
      new Decimal('0'),
    );

    let ratio: Decimal;

    if (totalExpense.isZero()) {
      // The user spent nothing last month — all limits are 0 regardless of
      // income. Avoid division by zero.
      ratio = new Decimal('0');
    } else if (totalIncome === null) {
      // No income transactions at all: we cannot estimate affordability.
      // Apply a conservative flat fallback to avoid overshooting.
      ratio = NO_INCOME_DATA_FALLBACK_RATE;
    } else {
      const affordableTotal = totalIncome.mul(
        new Decimal('1').minus(SAVINGS_RESERVE_RATE),
      );
      // Clamp to [0, 1]: never give a negative limit, never inflate past
      // actual spending.
      ratio = Decimal.min(new Decimal('1'), affordableTotal.div(totalExpense));
      if (ratio.isNegative()) ratio = new Decimal('0');
    }

    const result = new Map<number, string>();
    for (const [id, spend] of spendByCategory.entries()) {
      result.set(id, spend.mul(ratio).toDecimalPlaces(2).toFixed(2));
    }

    return result;
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  /**
   * Returns total INCOME for the user in [firstDay, lastDay).
   * Returns `null` (not zero!) when there are NO income transactions at all,
   * so the caller can distinguish "earned nothing" from "no data".
   */
  private async fetchTotalIncome(
    userId: number,
    firstDay: Date,
    lastDay: Date,
    em?: EntityManager,
  ): Promise<Decimal | null> {
    const resolvedEm = this.resolveEm(em);
    const qb = resolvedEm
      .createQueryBuilder(TransactionEntity, 't')
      .select(raw('SUM(t.amount) as total'), raw('COUNT(t.id) as cnt'))
      .where({
        'user.id': userId,
        transactionType: TransactionType.INCOME,
        createdAt: { $gte: firstDay, $lt: lastDay },
      });

    const rows =
      await qb.execute<{ total: string | null; cnt: string }[]>('all');
    const cnt = parseInt(rows[0]?.cnt ?? '0', 10);
    if (cnt === 0) return null; // no income transactions → unknown income
    return new Decimal(rows[0]?.total ?? '0');
  }

  /**
   * Returns per-category EXPENSE totals for the given categories in [firstDay, lastDay).
   * Only categories that have at least one transaction are included in the result;
   * missing ones are treated as 0 by the caller.
   */
  private async fetchExpenseByCategory(
    userId: number,
    categoryIds: number[],
    firstDay: Date,
    lastDay: Date,
    em?: EntityManager,
  ): Promise<{ categoryId: number; total: string }[]> {
    const resolvedEm = this.resolveEm(em);
    const qb = resolvedEm
      .createQueryBuilder(TransactionEntity, 't')
      .select(['t.category_id as categoryId', raw('SUM(t.amount)').as('total')])
      .where({
        'user.id': userId,
        transactionType: TransactionType.EXPENSE,
        'category.id': { $in: categoryIds },
        createdAt: { $gte: firstDay, $lt: lastDay },
      })
      .groupBy('t.category_id');

    return qb.execute<{ categoryId: number; total: string }[]>('all');
  }

  private resolveEm(em?: EntityManager): EntityManager {
    return (
      em ??
      (this.transactionRepository.getEntityManager() as unknown as EntityManager)
    );
  }

  private normalizeToFirstOfMonth(date: Date): Date {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
  }
}
