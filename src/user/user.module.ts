import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserEntity } from '../DAL/entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule } from '../configuration/config.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [ConfigModule, MikroOrmModule.forFeature([UserEntity])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
