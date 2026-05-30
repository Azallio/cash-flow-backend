import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '../configuration/config.service';

@Injectable()
export class SeedService extends Seeder {
  private readonly _logger: Logger;

  constructor(private readonly configService: ConfigService) {
    super();

    this._logger = new Logger(SeedService.name);
  }

  async run(em: EntityManager): Promise<void> {}
}
