import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { WarehouseService } from '../services/warehouse.service';
import { WarehouseResponseDto } from '../dto/warehouse.dto';

@Controller('warehouse')
export class WarehouseController {
    constructor(private readonly warehouseService: WarehouseService) { }

    @Get()
    async findAll(): Promise<WarehouseResponseDto[]> {
        return await this.warehouseService.findAll();
    }

    @Get('active')
    async findActive(): Promise<WarehouseResponseDto[]> {
        return await this.warehouseService.findActive();
    }

    @Get('country/:countryId')
    async findByCountryId(
        @Param('countryId', ParseIntPipe) countryId: number,
    ): Promise<WarehouseResponseDto[]> {
        return await this.warehouseService.findByCountryId(countryId);
    }

    @Get('code/:warehouseCode')
    async findByWarehouseCode(
        @Param('warehouseCode') warehouseCode: string,
    ): Promise<WarehouseResponseDto> {
        return await this.warehouseService.findByWarehouseCode(warehouseCode);
    }

    @Get('uuid/:uuid')
    async findByUuid(@Param('uuid') uuid: string): Promise<WarehouseResponseDto> {
        return await this.warehouseService.findByUuid(uuid);
    }

    @Get(':id')
    async findById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<WarehouseResponseDto> {
        return await this.warehouseService.findById(id);
    }
}
