import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { VehicleTypeService } from '../services/vehicle-type.service';
import { VehicleTypeResponseDto } from '../dto/vehicle-type.dto';

@Controller('fleet/vehicle-types')
export class VehicleTypeController {
    constructor(private readonly vehicleTypeService: VehicleTypeService) { }

    @Get()
    async findAll(): Promise<VehicleTypeResponseDto[]> {
        return await this.vehicleTypeService.findAll();
    }

    @Get('active')
    async findActive(): Promise<VehicleTypeResponseDto[]> {
        return await this.vehicleTypeService.findActive();
    }

    @Get('code/:typeCode')
    async findByTypeCode(
        @Param('typeCode') typeCode: string,
    ): Promise<VehicleTypeResponseDto> {
        return await this.vehicleTypeService.findByTypeCode(typeCode);
    }

    @Get(':id')
    async findById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<VehicleTypeResponseDto> {
        return await this.vehicleTypeService.findById(id);
    }
}
