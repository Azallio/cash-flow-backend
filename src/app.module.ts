/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module, RequestMethod } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { LoggerModule } from 'nestjs-pino';
import { join } from 'path';
import { stdSerializers } from 'pino-http';
import { DatabaseModule } from './DAL/database.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './configuration/config.module';
import { UserModule } from './user/user.module';
import { TransactionModule } from './transaction/transaction.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    ConfigModule,
    LoggerModule.forRoot({
      forRoutes: [{ method: RequestMethod.ALL, path: '/api/*path' }],
      pinoHttp: {
        serializers: {
          req(req: any) {
            const { headers, ...rest } = req;
            return { ...rest };
          },
          res(res: any) {
            const { headers, ...rest } = res;
            return { ...rest };
          },
          err: stdSerializers.err,
        },
      },
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    TransactionModule,
    CategoryModule,
  ],
})
export class AppModule {}
