import { Migration } from '@mikro-orm/migrations';

export class Migration20260707100000 extends Migration {
  override async up(): Promise<void> {
    // Ensures idempotency: only one auto-generated (or manual) budget can exist
    // per category × period × month combination.
    this.addSql(
      `alter table "budget_entity" add constraint "budget_entity_category_period_month_unique" unique ("category_id", "period", "month");`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "budget_entity" drop constraint "budget_entity_category_period_month_unique";`,
    );
  }
}
