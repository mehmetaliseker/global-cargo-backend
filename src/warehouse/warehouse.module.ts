import { Module } from '@nestjs/common';
import { WarehouseModule as WarehouseSubModule } from './warehouse/warehouse.module';
import { WarehouseLocationModule } from './warehouse-location/warehouse-location.module';
import { WarehouseCapacityModule } from './warehouse-capacity/warehouse-capacity.module';
import { ContainerModule } from './container/container.module';
import { ContainerCargoAssignmentModule } from './container-cargo-assignment/container-cargo-assignment.module';

@Module({
    imports: [
        WarehouseSubModule,
        WarehouseLocationModule,
        WarehouseCapacityModule,
        ContainerModule,
        ContainerCargoAssignmentModule,
    ],
    exports: [
        WarehouseSubModule,
        WarehouseLocationModule,
        WarehouseCapacityModule,
        ContainerModule,
        ContainerCargoAssignmentModule,
    ],
})
export class WarehouseModule { }
