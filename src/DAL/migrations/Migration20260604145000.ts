import { Migration } from '@mikro-orm/migrations';

export class Migration20260604145000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "category_entity" add column if not exists "title" varchar(255) not null default '';`,
    );
    this.addSql(
      `alter table "category_entity" add column if not exists "description" varchar(255) null;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "category_entity" drop column if exists "title";`);
    this.addSql(
      `alter table "category_entity" drop column if exists "description";`,
    );
  }
}
