import { Migration } from '@mikro-orm/migrations';

export class Migration20260530000100 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`drop table if exists "user_entity" cascade;`);

    this.addSql(
      `create table "users" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "email" varchar(255) not null, "password_hash" varchar(255) not null);`,
    );
    this.addSql(
      `alter table "users" add constraint "users_email_unique" unique ("email");`,
    );

    this.addSql(
      `create table "categories" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "user_id" int not null);`,
    );

    this.addSql(
      `create table "refresh_tokens" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "user_id" int not null, "token_hash" varchar(255) not null, "expires_at" timestamptz not null);`,
    );

    this.addSql(
      `create table "transactions" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "user_id" int not null, "category_id" int not null, "transaction_type" text check ("transaction_type" in ('expense', 'income')) not null);`,
    );

    this.addSql(
      `alter table "categories" add constraint "categories_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "refresh_tokens" add constraint "refresh_tokens_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "transactions" add constraint "transactions_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "transactions" add constraint "transactions_category_id_foreign" foreign key ("category_id") references "categories" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "transactions" cascade;`);
    this.addSql(`drop table if exists "refresh_tokens" cascade;`);
    this.addSql(`drop table if exists "categories" cascade;`);
    this.addSql(`drop table if exists "users" cascade;`);

    this.addSql(
      `create table "user_entity" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null);`,
    );
  }
}
