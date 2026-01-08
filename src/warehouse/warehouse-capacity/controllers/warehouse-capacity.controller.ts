import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { WarehouseCapacityService } from '../services/warehouse-capacity.service';
import { WarehouseCapacityResponseDto } from '../dto/warehouse-capacity.dto';

@Controller('warehouse/capacities')
export class WarehouseCapacityController {
    constructor(
        private readonly warehouseCapacityService: WarehouseCapacityService,
    ) { }

    @Get()
    async findAll(): Promise<WarehouseCapacityResponseDto[]> {
        return await this.warehouseCapacityService.findAll();
    }

    @Get('alerts')
    async findAlerts(): Promise<WarehouseCapacityResponseDto[]> {
        return await this.warehouseCapacityService.findAlerts();
    }

    @Get('warehouse/:warehouseId')
    async findByWarehouseId(
        @Param('warehouseId', ParseIntPipe) warehouseId: number,
    ): Promise<WarehouseCapacityResponseDto[]> {
        return await this.warehouseCapacityService.findByWarehouseId(warehouseId);
    }

    @Get('type/:capacityType')
    async findByCapacityType(
        @Param('capacityType') capacityType: string,
    ): Promise<WarehouseCapacityResponseDto[]> {
        return await this.warehouseCapacityService.findByCapacityType(capacityType);
    }

    @Get(':id')
    async findById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<WarehouseCapacityResponseDto> {
        return await this.warehouseCapacityService.findById(id);
    }
}
