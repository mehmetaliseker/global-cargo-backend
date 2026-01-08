import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { VehicleCargoAssignmentRepository } from './repositories/vehicle-cargo-assignment.repository';
import { VehicleCargoAssignmentService } from './services/vehicle-cargo-assignment.service';
import { VehicleCargoAssignmentController } from './controllers/vehicle-cargo-assignment.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [VehicleCargoAssignmentController],
    providers: [
        VehicleCargoAssignmentRepository,
        VehicleCargoAssignmentService,
    ],
    exports: [VehicleCargoAssignmentService, VehicleCargoAssignmentRepository],
})
export class VehicleCargoAssignmentModule { }
