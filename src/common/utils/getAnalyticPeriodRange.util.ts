import { AnalyticPeriod } from '../enums/analytic-period.enum';

export type AnalyticPeriodRange = {
  currentStart?: Date;
  currentEnd?: Date;
  previousStart?: Date;
  previousEnd?: Date;
};

export function getAnalyticPeriodRange(
  period?: AnalyticPeriod,
): AnalyticPeriodRange {
  if (period == null) {
    return {};
  }

  const now = new Date();

  if (period === AnalyticPeriod.DAY) {
    const currentStart = new Date(now);
    currentStart.setHours(0, 0, 0, 0);

    const currentEnd = new Date(now);
    currentEnd.setHours(23, 59, 59, 999);

    const previousStart = new Date(currentStart);
    previousStart.setDate(previousStart.getDate() - 1);

    const previousEnd = new Date(currentEnd);
    previousEnd.setDate(previousEnd.getDate() - 1);

    return { currentStart, currentEnd, previousStart, previousEnd };
  }

  if (period === AnalyticPeriod.MONTH) {
    const currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentEnd = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    const previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59,
      999,
    );

    return { currentStart, currentEnd, previousStart, previousEnd };
  }

  const currentStart = new Date(now.getFullYear(), 0, 1);
  const currentEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
  const previousStart = new Date(now.getFullYear() - 1, 0, 1);
  const previousEnd = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);

  return { currentStart, currentEnd, previousStart, previousEnd };
}
