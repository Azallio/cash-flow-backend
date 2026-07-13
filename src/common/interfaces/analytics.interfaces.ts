// interfaces/analytics.interfaces.ts

/** Текущее значение + предыдущее + % изменения. Используется во всех карточках overview. */
export interface MetricWithChange {
  current: string;
  previous: string;
  changePercent: number | null; // null, если previous === 0 (деление на 0 не определено)
}

export interface OverviewResponse {
  income: MetricWithChange;
  expense: MetricWithChange;
  savings: MetricWithChange; // income - expense за период
  balance: MetricWithChange; // накопленный остаток на конец периода
}

export interface TimeSeriesPoint {
  bucket: string; // ISO-дата начала бакета (день/неделя/месяц)
  income: string;
  expense: string;
}

export interface CategoryBreakdownItem {
  categoryId: number;
  categoryName: string;
  total: string;
  percent: number; // доля от суммы всех категорий в ответе, 0-100
}
