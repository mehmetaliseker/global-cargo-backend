import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { WarehouseLocationRepository } from './repositories/warehouse-location.repository';
import { WarehouseLocationService } from './services/warehouse-location.service';
import { WarehouseLocationController } from './controllers/warehouse-location.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [WarehouseLocationController],
    providers: [WarehouseLocationRepository, WarehouseLocationService],
    exports: [WarehouseLocationService, WarehouseLocationRepository],
})
export class WarehouseLocationModule { }
