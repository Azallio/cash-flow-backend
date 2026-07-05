import { Migration } from '@mikro-orm/migrations';

export class Migration20260705132453 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user_entity" add column "role" varchar(255) not null default 'user';`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user_entity" drop column "role";`);
  }

}
