import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../common/enums/user-role.enum';
import { ConfigService } from '../configuration/config.service';

@Injectable()
export class SeedService extends Seeder {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly configService: ConfigService) {
    super();
  }

  async run(em: EntityManager): Promise<void> {
    this.logger.log('Seeding database...');

    const adminEmail = this.configService.adminEmail;
    const adminPassword = this.configService.adminPassword;

    const existingAdmin = await em.findOne('UserEntity', { email: adminEmail });
    if (existingAdmin) {
      this.logger.log('Admin user already exists. Skipping seeding.');
      return;
    }

    const adminUser = em.create('UserEntity', {
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 10),
      role: UserRole.ADMIN,
    });

    await em.persist(adminUser).flush();

    this.logger.log('Admin user created successfully.');
  }
}
