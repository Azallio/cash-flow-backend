/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module } from '@nestjs/common';
import { DatabaseModule } from './DAL/database.module';
import { ConfigModule } from './configuration/config.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { LoggerModule } from 'nestjs-pino';
import { stdSerializers } from 'pino-http';
import { UserModule } from './user/user.module';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    ConfigModule,
    LoggerModule.forRoot({
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
    UserModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  providers: [AuthService],
})
export class AppModule {}
