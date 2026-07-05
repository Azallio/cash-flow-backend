import { Migration } from '@mikro-orm/migrations';

export class Migration20260705110051 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "monthly_budget_plan_entity" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "user_id" int not null, "month" date not null, "projected_income" decimal(12,2) not null);`);
    this.addSql(`alter table "monthly_budget_plan_entity" add constraint "monthly_budget_plan_entity_user_id_month_unique" unique ("user_id", "month");`);

    this.addSql(`create table "budget_adjustment_entity" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "target_budget_id" int not null, "amount" decimal(12,2) not null, "source" text check ("source" in ('income_increase', 'budget_reallocation')) not null, "source_budget_id" int null, "reason" varchar(255) null);`);

    this.addSql(`alter table "monthly_budget_plan_entity" add constraint "monthly_budget_plan_entity_user_id_foreign" foreign key ("user_id") references "user_entity" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "budget_adjustment_entity" add constraint "budget_adjustment_entity_target_budget_id_foreign" foreign key ("target_budget_id") references "budget_entity" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "budget_adjustment_entity" add constraint "budget_adjustment_entity_source_budget_id_foreign" foreign key ("source_budget_id") references "budget_entity" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "transaction_entity" drop constraint "transaction_entity_user_id_foreign";`);

    this.addSql(`alter table "budget_entity" drop constraint "budget_entity_user_id_foreign";`);

    this.addSql(`alter table "transaction_entity" add constraint "transaction_entity_user_id_foreign" foreign key ("user_id") references "user_entity" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "budget_entity" drop column "title", drop column "target_amount", drop column "collected_amount", drop column "description", drop column "start_period", drop column "end_period";`);

    this.addSql(`alter table "budget_entity" add column "period" text check ("period" in ('monthly', 'custom')) not null, add column "limit_amount" decimal(12,2) not null, add column "start_date" date null, add column "end_date" date null, add column "is_active" boolean not null default true, add column "is_auto_generated" boolean not null default false, add column "month" date null;`);
    this.addSql(`alter table "budget_entity" rename column "user_id" to "category_id";`);
    this.addSql(`alter table "budget_entity" add constraint "budget_entity_category_id_foreign" foreign key ("category_id") references "category_entity" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "monthly_budget_plan_entity" cascade;`);

    this.addSql(`drop table if exists "budget_adjustment_entity" cascade;`);

    this.addSql(`alter table "budget_entity" drop constraint "budget_entity_category_id_foreign";`);

    this.addSql(`alter table "transaction_entity" drop constraint "transaction_entity_user_id_foreign";`);

    this.addSql(`alter table "budget_entity" drop column "period", drop column "limit_amount", drop column "start_date", drop column "end_date", drop column "is_active", drop column "is_auto_generated", drop column "month";`);

    this.addSql(`alter table "budget_entity" add column "title" varchar(255) not null, add column "target_amount" int4 not null, add column "collected_amount" int4 not null, add column "description" varchar(255) null, add column "start_period" timestamptz(6) not null, add column "end_period" timestamptz(6) not null;`);
    this.addSql(`alter table "budget_entity" rename column "category_id" to "user_id";`);
    this.addSql(`alter table "budget_entity" add constraint "budget_entity_user_id_foreign" foreign key ("user_id") references "user_entity" ("id") on update cascade on delete no action;`);

    this.addSql(`alter table "transaction_entity" add constraint "transaction_entity_user_id_foreign" foreign key ("user_id") references "user_entity" ("id") on update cascade on delete no action;`);
  }

}
