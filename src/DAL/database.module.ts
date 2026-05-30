import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module, Scope } from '@nestjs/common';
import DatabaseConfig from './mikroorm.config';
import { SeedService } from './seed.service';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      scope: Scope.REQUEST,
      registerRequestContext: true,
      ...DatabaseConfig,
    }),
  ],
  providers: [SeedService],
})
export class DatabaseModule {}
