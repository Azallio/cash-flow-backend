import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../common/middlewares/guards/strategies/jwtStrategy';
import { ConfigService } from '../configuration/config.service';
import { RefreshTokenEntity } from '../DAL/entities/refresh-token.entity';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from './jwt.service';

@Module({
  imports: [
    UserModule,
    MikroOrmModule.forFeature([RefreshTokenEntity]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.jwtModuleConfig.secret,
        signOptions: configService.jwtModuleConfig.signOptions,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtService],
})
export class AuthModule {}
