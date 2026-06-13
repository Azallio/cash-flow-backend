import { Migration } from '@mikro-orm/migrations';

export class Migration20260613121627 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "budget_entity" add column "start_period" timestamptz not null, add column "end_period" timestamptz not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "budget_entity" drop column "start_period", drop column "end_period";`);
  }

}
