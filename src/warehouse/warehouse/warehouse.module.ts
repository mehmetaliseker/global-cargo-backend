import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { WarehouseRepository } from './repositories/warehouse.repository';
import { WarehouseService } from './services/warehouse.service';
import { WarehouseController } from './controllers/warehouse.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [WarehouseController],
    providers: [WarehouseRepository, WarehouseService],
    exports: [WarehouseService, WarehouseRepository],
})
export class WarehouseModule { }
