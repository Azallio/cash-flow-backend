import { Migration } from '@mikro-orm/migrations';

export class Migration20260601113131 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user_entity" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "email" varchar(255) not null, "password_hash" varchar(255) not null);`);
    this.addSql(`alter table "user_entity" add constraint "user_entity_email_unique" unique ("email");`);

    this.addSql(`create table "refresh_token_entity" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "user_id" int not null, "token_hash" varchar(255) not null, "expires_at" timestamptz not null);`);

    this.addSql(`create table "category_entity" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "user_id" int not null);`);

    this.addSql(`create table "transaction_entity" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "user_id" int not null, "category_id" int not null, "transaction_type" text check ("transaction_type" in ('expense', 'income')) not null);`);

    this.addSql(`alter table "refresh_token_entity" add constraint "refresh_token_entity_user_id_foreign" foreign key ("user_id") references "user_entity" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "category_entity" add constraint "category_entity_user_id_foreign" foreign key ("user_id") references "user_entity" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "transaction_entity" add constraint "transaction_entity_user_id_foreign" foreign key ("user_id") references "user_entity" ("id") on update cascade;`);
    this.addSql(`alter table "transaction_entity" add constraint "transaction_entity_category_id_foreign" foreign key ("category_id") references "category_entity" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "refresh_token_entity" drop constraint "refresh_token_entity_user_id_foreign";`);

    this.addSql(`alter table "category_entity" drop constraint "category_entity_user_id_foreign";`);

    this.addSql(`alter table "transaction_entity" drop constraint "transaction_entity_user_id_foreign";`);

    this.addSql(`alter table "transaction_entity" drop constraint "transaction_entity_category_id_foreign";`);

    this.addSql(`drop table if exists "user_entity" cascade;`);

    this.addSql(`drop table if exists "refresh_token_entity" cascade;`);

    this.addSql(`drop table if exists "category_entity" cascade;`);

    this.addSql(`drop table if exists "transaction_entity" cascade;`);
  }

}
