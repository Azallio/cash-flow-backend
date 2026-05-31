import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Injectable, Logger } from '@nestjs/common';
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

    const newUser = em.create('UserEntity', {
      email: 'test@example.com',
      passwordHash:
        '$2b$10$x7TzXvLZ8wzUzbAs.l7cHuVqwAHCCSDurRsx6aoG9f3EfKnJ2y61m',
    });

    await em.persist(newUser).flush();

    this.logger.debug('Seeded user: test@example.com');
    this.logger.debug('Seeders finished');
  }
}
