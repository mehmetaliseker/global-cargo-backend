import { Module } from '@nestjs/common';
import { FleetModule as FleetSubModule } from './fleet/fleet.module';
import { VehicleTypeModule } from './vehicle-type/vehicle-type.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { VehicleMaintenanceModule } from './vehicle-maintenance/vehicle-maintenance.module';
import { VehicleCargoAssignmentModule } from './vehicle-cargo-assignment/vehicle-cargo-assignment.module';

@Module({
    imports: [
        FleetSubModule,
        VehicleTypeModule,
        VehicleModule,
        VehicleMaintenanceModule,
        VehicleCargoAssignmentModule,
    ],
    exports: [
        FleetSubModule,
        VehicleTypeModule,
        VehicleModule,
        VehicleMaintenanceModule,
        VehicleCargoAssignmentModule,
    ],
})
export class FleetModule { }
