import { Module } from '@nestjs/common';
import { RouteModule } from './route/route.module';
import { RouteRiskScoreModule } from './route-risk-score/route-risk-score.module';
import { CargoRouteAssignmentModule } from './cargo-route-assignment/cargo-route-assignment.module';
import { CourierRoutePlanModule } from './courier-route-plan/courier-route-plan.module';
import { CargoCarbonDataModule } from './cargo-carbon-data/cargo-carbon-data.module';

@Module({
  imports: [
    RouteModule,
    RouteRiskScoreModule,
    CargoRouteAssignmentModule,
    CourierRoutePlanModule,
    CargoCarbonDataModule,
  ],
  exports: [
    RouteModule,
    RouteRiskScoreModule,
    CargoRouteAssignmentModule,
    CourierRoutePlanModule,
    CargoCarbonDataModule,
  ],
})
export class RoutingModule {}

