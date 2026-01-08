import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { VehicleService } from '../services/vehicle.service';
import { VehicleResponseDto } from '../dto/vehicle.dto';

@Controller('fleet/vehicles')
export class VehicleController {
    constructor(private readonly vehicleService: VehicleService) { }

    @Get()
    async findAll(): Promise<VehicleResponseDto[]> {
        return await this.vehicleService.findAll();
    }

    @Get('active')
    async findActive(): Promise<VehicleResponseDto[]> {
        return await this.vehicleService.findActive();
    }

    @Get('in-use')
    async findInUse(): Promise<VehicleResponseDto[]> {
        return await this.vehicleService.findInUse();
    }

    @Get('code/:vehicleCode')
    async findByVehicleCode(
        @Param('vehicleCode') vehicleCode: string,
    ): Promise<VehicleResponseDto> {
        return await this.vehicleService.findByVehicleCode(vehicleCode);
    }

    @Get('plate/:licensePlate')
    async findByLicensePlate(
        @Param('licensePlate') licensePlate: string,
    ): Promise<VehicleResponseDto> {
        return await this.vehicleService.findByLicensePlate(licensePlate);
    }

    @Get('uuid/:uuid')
    async findByUuid(@Param('uuid') uuid: string): Promise<VehicleResponseDto> {
        return await this.vehicleService.findByUuid(uuid);
    }

    @Get(':id')
    async findById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<VehicleResponseDto> {
        return await this.vehicleService.findById(id);
    }
}
