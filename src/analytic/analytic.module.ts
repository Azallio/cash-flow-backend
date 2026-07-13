import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { TransactionEntity } from '../DAL/entities/transaction.entity';
import { TransactionModule } from '../transaction/transaction.module';
import { AnalyticsController } from './analytic.controller';
import { AnalyticsService } from './analytic.service';

@Module({
  controllers: [AnalyticsController],
  imports: [MikroOrmModule.forFeature([TransactionEntity]), TransactionModule],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
