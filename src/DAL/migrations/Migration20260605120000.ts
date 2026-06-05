import { Migration } from '@mikro-orm/migrations';

export class Migration20260605120000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "category_entity" add column if not exists "transaction_type" text check ("transaction_type" in ('expense', 'income')) not null default 'expense';`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "category_entity" drop column if exists "transaction_type";`,
    );
  }
}
