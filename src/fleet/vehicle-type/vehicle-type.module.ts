import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { VehicleTypeRepository } from './repositories/vehicle-type.repository';
import { VehicleTypeService } from './services/vehicle-type.service';
import { VehicleTypeController } from './controllers/vehicle-type.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [VehicleTypeController],
    providers: [VehicleTypeRepository, VehicleTypeService],
    exports: [VehicleTypeService, VehicleTypeRepository],
})
export class VehicleTypeModule { }
