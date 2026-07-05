import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CategoryEntity } from '../DAL/entities/category.entity';
import { UserEntity } from '../DAL/entities/user.entity';
import { UserModule } from '../user/user.module';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([CategoryEntity, UserEntity]),
    UserModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
