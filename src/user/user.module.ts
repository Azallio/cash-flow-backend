import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '../configuration/config.module';
import { UserEntity } from '../DAL/entities/user.entity';
import { UsersController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [ConfigModule, MikroOrmModule.forFeature([UserEntity])],
  providers: [UserService],
  controllers: [UsersController],
  exports: [UserService],
})
export class UsersModule {}
