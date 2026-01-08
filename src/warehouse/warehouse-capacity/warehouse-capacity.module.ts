import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { WarehouseCapacityRepository } from './repositories/warehouse-capacity.repository';
import { WarehouseCapacityService } from './services/warehouse-capacity.service';
import { WarehouseCapacityController } from './controllers/warehouse-capacity.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [WarehouseCapacityController],
    providers: [WarehouseCapacityRepository, WarehouseCapacityService],
    exports: [WarehouseCapacityService, WarehouseCapacityRepository],
})
export class WarehouseCapacityModule { }
