import { Migration } from '@mikro-orm/migrations';

export class Migration20260530183540 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "refresh_token_entity" drop constraint "refresh_token_entity_user_id_foreign";`);

    this.addSql(`alter table "category_entity" drop constraint "category_entity_user_id_foreign";`);

    this.addSql(`alter table "refresh_token_entity" add constraint "refresh_token_entity_user_id_foreign" foreign key ("user_id") references "user_entity" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "category_entity" add constraint "category_entity_user_id_foreign" foreign key ("user_id") references "user_entity" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "category_entity" drop constraint "category_entity_user_id_foreign";`);

    this.addSql(`alter table "refresh_token_entity" drop constraint "refresh_token_entity_user_id_foreign";`);

    this.addSql(`alter table "category_entity" add constraint "category_entity_user_id_foreign" foreign key ("user_id") references "user_entity" ("id") on update cascade on delete no action;`);

    this.addSql(`alter table "refresh_token_entity" add constraint "refresh_token_entity_user_id_foreign" foreign key ("user_id") references "user_entity" ("id") on update cascade on delete no action;`);
  }

}
