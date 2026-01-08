import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { RouteRiskScoreRepository } from './repositories/route-risk-score.repository';
import { RouteRiskScoreService } from './services/route-risk-score.service';
import { RouteRiskScoreController } from './controllers/route-risk-score.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [RouteRiskScoreController],
  providers: [RouteRiskScoreRepository, RouteRiskScoreService],
  exports: [RouteRiskScoreService, RouteRiskScoreRepository],
})
export class RouteRiskScoreModule {}

