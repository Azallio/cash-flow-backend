import { Migration } from '@mikro-orm/migrations';

export class Migration20260613120413 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "budget_entity" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "user_id" int not null, "title" varchar(255) not null, "target_amount" int not null, "collected_amount" int not null, "description" varchar(255) null);`);

    this.addSql(`alter table "budget_entity" add constraint "budget_entity_user_id_foreign" foreign key ("user_id") references "user_entity" ("id") on update cascade;`);

    this.addSql(`alter table "category_entity" alter column "title" drop default;`);
    this.addSql(`alter table "category_entity" alter column "title" type varchar(255) using ("title"::varchar(255));`);
    this.addSql(`alter table "category_entity" alter column "transaction_type" drop default;`);
    this.addSql(`alter table "category_entity" alter column "transaction_type" type text using ("transaction_type"::text);`);

    this.addSql(`alter table "transaction_entity" alter column "amount" drop default;`);
    this.addSql(`alter table "transaction_entity" alter column "amount" type int using ("amount"::int);`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "budget_entity" cascade;`);

    this.addSql(`alter table "category_entity" alter column "title" type varchar(255) using ("title"::varchar(255));`);
    this.addSql(`alter table "category_entity" alter column "title" set default '';`);
    this.addSql(`alter table "category_entity" alter column "transaction_type" type text using ("transaction_type"::text);`);
    this.addSql(`alter table "category_entity" alter column "transaction_type" set default 'expense';`);

    this.addSql(`alter table "transaction_entity" alter column "amount" type int4 using ("amount"::int4);`);
    this.addSql(`alter table "transaction_entity" alter column "amount" set default 0;`);
  }

}
