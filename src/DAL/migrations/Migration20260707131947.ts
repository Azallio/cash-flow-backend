import { Migration } from '@mikro-orm/migrations';

export class Migration20260707131947 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "budget_entity" drop constraint "budget_entity_category_period_month_unique";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "budget_entity" add constraint "budget_entity_category_period_month_unique" unique ("category_id", "period", "month");`);
  }

}
