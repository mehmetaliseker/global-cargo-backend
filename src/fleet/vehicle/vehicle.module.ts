import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { VehicleRepository } from './repositories/vehicle.repository';
import { VehicleService } from './services/vehicle.service';
import { VehicleController } from './controllers/vehicle.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [VehicleController],
    providers: [VehicleRepository, VehicleService],
    exports: [VehicleService, VehicleRepository],
})
export class VehicleModule { }
