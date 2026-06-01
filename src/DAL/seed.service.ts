import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '../configuration/config.service';

@Injectable()
export class SeedService extends Seeder {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly configService: ConfigService) {
    super();
  }

  async run(em: EntityManager): Promise<void> {
    this.logger.debug('Running seeders...');

    const user = await em.findOne('UserEntity', {
      email: 'test@example.com',
    });

    if (user) {
      this.logger.debug('User already exists, skipping seeding');
      return;
    }

    const passwordHash = bcrypt.hashSync('SuperSecret123', 10);

    const newUser = em.create('UserEntity', {
      email: 'test@example.com',
      passwordHash: passwordHash,
    });

    await em.persist(newUser).flush();

    this.logger.debug('Seeded user: test@example.com');
    this.logger.debug('Seeders finished');
  }
}
