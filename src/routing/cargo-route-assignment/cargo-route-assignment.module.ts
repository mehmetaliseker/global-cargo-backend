import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { CargoRouteAssignmentRepository } from './repositories/cargo-route-assignment.repository';
import { CargoRouteAssignmentService } from './services/cargo-route-assignment.service';
import { CargoRouteAssignmentController } from './controllers/cargo-route-assignment.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [CargoRouteAssignmentController],
  providers: [CargoRouteAssignmentRepository, CargoRouteAssignmentService],
  exports: [CargoRouteAssignmentService, CargoRouteAssignmentRepository],
})
export class CargoRouteAssignmentModule {}

