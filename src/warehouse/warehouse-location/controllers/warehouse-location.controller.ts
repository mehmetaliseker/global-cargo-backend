import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { WarehouseLocationService } from '../services/warehouse-location.service';
import { WarehouseLocationResponseDto } from '../dto/warehouse-location.dto';

@Controller('warehouse/locations')
export class WarehouseLocationController {
    constructor(
        private readonly warehouseLocationService: WarehouseLocationService,
    ) { }

    @Get()
    async findAll(): Promise<WarehouseLocationResponseDto[]> {
        return await this.warehouseLocationService.findAll();
    }

    @Get('active')
    async findActive(): Promise<WarehouseLocationResponseDto[]> {
        return await this.warehouseLocationService.findActive();
    }

    @Get('warehouse/:warehouseId')
    async findByWarehouseId(
        @Param('warehouseId', ParseIntPipe) warehouseId: number,
    ): Promise<WarehouseLocationResponseDto[]> {
        return await this.warehouseLocationService.findByWarehouseId(warehouseId);
    }

    @Get('warehouse/:warehouseId/code/:locationCode')
    async findByLocationCode(
        @Param('warehouseId', ParseIntPipe) warehouseId: number,
        @Param('locationCode') locationCode: string,
    ): Promise<WarehouseLocationResponseDto> {
        return await this.warehouseLocationService.findByLocationCode(
            warehouseId,
            locationCode,
        );
    }

    @Get(':id')
    async findById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<WarehouseLocationResponseDto> {
        return await this.warehouseLocationService.findById(id);
    }
}
