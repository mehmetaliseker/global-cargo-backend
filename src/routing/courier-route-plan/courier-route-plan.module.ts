import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { CourierRoutePlanRepository } from './repositories/courier-route-plan.repository';
import { CourierRoutePlanService } from './services/courier-route-plan.service';
import { CourierRoutePlanController } from './controllers/courier-route-plan.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [CourierRoutePlanController],
  providers: [CourierRoutePlanRepository, CourierRoutePlanService],
  exports: [CourierRoutePlanService, CourierRoutePlanRepository],
})
export class CourierRoutePlanModule {}

