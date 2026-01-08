import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { VehicleMaintenanceRepository } from './repositories/vehicle-maintenance.repository';
import { VehicleMaintenanceService } from './services/vehicle-maintenance.service';
import { VehicleMaintenanceController } from './controllers/vehicle-maintenance.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [VehicleMaintenanceController],
    providers: [VehicleMaintenanceRepository, VehicleMaintenanceService],
    exports: [VehicleMaintenanceService, VehicleMaintenanceRepository],
})
export class VehicleMaintenanceModule { }
