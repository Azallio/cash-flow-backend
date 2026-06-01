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

  async run(em: EntityManager): Promise<void> {}
}
