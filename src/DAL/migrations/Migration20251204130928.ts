import { Migration } from '@mikro-orm/migrations';

export class Migration20251204130928 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user_entity" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null);`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "user_entity" cascade;`);
  }

}
