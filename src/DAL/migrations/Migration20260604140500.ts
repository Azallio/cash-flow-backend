import { Migration } from '@mikro-orm/migrations';

export class Migration20260604140500 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "transaction_entity" add column if not exists "amount" int not null default 0;`,
    );
    this.addSql(
      `alter table "transaction_entity" add column if not exists "description" varchar(255) null;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "transaction_entity" drop column if exists "amount";`,
    );
    this.addSql(
      `alter table "transaction_entity" drop column if exists "description";`,
    );
  }
}
