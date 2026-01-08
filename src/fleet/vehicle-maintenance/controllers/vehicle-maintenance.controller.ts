import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { VehicleMaintenanceService } from '../services/vehicle-maintenance.service';
import { VehicleMaintenanceResponseDto } from '../dto/vehicle-maintenance.dto';

@Controller('fleet/vehicle-maintenance')
export class VehicleMaintenanceController {
    constructor(
        private readonly vehicleMaintenanceService: VehicleMaintenanceService,
    ) { }

    @Get()
    async findAll(): Promise<VehicleMaintenanceResponseDto[]> {
        return await this.vehicleMaintenanceService.findAll();
    }

    @Get('upcoming')
    async findUpcomingMaintenance(): Promise<VehicleMaintenanceResponseDto[]> {
        return await this.vehicleMaintenanceService.findUpcomingMaintenance();
    }

    @Get('vehicle/:vehicleId')
    async findByVehicleId(
        @Param('vehicleId', ParseIntPipe) vehicleId: number,
    ): Promise<VehicleMaintenanceResponseDto[]> {
        return await this.vehicleMaintenanceService.findByVehicleId(vehicleId);
    }

    @Get(':id')
    async findById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<VehicleMaintenanceResponseDto> {
        return await this.vehicleMaintenanceService.findById(id);
    }
}
