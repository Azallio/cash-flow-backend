import { MikroORM } from '@mikro-orm/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ApiResponseFormatMiddleware } from './common/middlewares/apiResponseFormat.middleware';
import { ErrorHandlerMiddleware } from './common/middlewares/errorHandler.middleware';
import { ConfigService } from './configuration/config.service';
import DatabaseConfig from './DAL/mikroorm.config';
import { SeedService } from './DAL/seed.service';

class Application {
  private readonly _validNodeEnvs = ['production', 'stage', 'development'];

  async bootstrap() {
    const { NODE_ENV } = process.env;

    if (NODE_ENV == null || !this._validNodeEnvs.includes(NODE_ENV)) {
      throw new Error(
        `Invalid application environment was provided: ${NODE_ENV}`,
      );
    }
    const app = await NestFactory.create(AppModule);
    const configuration = app.get(ConfigService);

    await this.runMigrations(app, true);
    await this.addMiddlewares(app);

    await this.addSwagger(app);

    app.setGlobalPrefix('api');
    app.enableCors();

    await app.listen(configuration.appPort);
  }

  private async runMigrations(
    app: INestApplication<any>,
    seed: boolean = false,
    cleanUp: boolean = false,
  ): Promise<void> {
    const mikroOrm = await MikroORM.init(DatabaseConfig);
    if (cleanUp) await mikroOrm.schema.dropDatabase();

    const migrator = mikroOrm.migrator;
    await migrator.up();

    if (seed) {
      const seedService = app.get(SeedService);
      const em = mikroOrm.em.fork();
      await seedService.run(em);
    }

    await mikroOrm.close();
  }

  private async addMiddlewares(app: INestApplication): Promise<void> {
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalInterceptors(new ApiResponseFormatMiddleware());
    app.useGlobalFilters(new ErrorHandlerMiddleware());
  }

  private async addSwagger(app: INestApplication): Promise<void> {
    const config = new DocumentBuilder()
      .setTitle('Template')
      .setVersion('0.0.1')
      .addServer('/api')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'jwt',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/swagger', app, document);
  }
}

new Application().bootstrap();
