import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { VehicleCargoAssignmentService } from '../services/vehicle-cargo-assignment.service';
import { VehicleCargoAssignmentResponseDto } from '../dto/vehicle-cargo-assignment.dto';

@Controller('fleet/vehicle-cargo-assignments')
export class VehicleCargoAssignmentController {
    constructor(
        private readonly vehicleCargoAssignmentService: VehicleCargoAssignmentService,
    ) { }

    @Get()
    async findAll(): Promise<VehicleCargoAssignmentResponseDto[]> {
        return await this.vehicleCargoAssignmentService.findAll();
    }

    @Get('vehicle/:vehicleId')
    async findByVehicleId(
        @Param('vehicleId', ParseIntPipe) vehicleId: number,
    ): Promise<VehicleCargoAssignmentResponseDto[]> {
        return await this.vehicleCargoAssignmentService.findByVehicleId(vehicleId);
    }

    @Get('cargo/:cargoId')
    async findByCargoId(
        @Param('cargoId', ParseIntPipe) cargoId: number,
    ): Promise<VehicleCargoAssignmentResponseDto[]> {
        return await this.vehicleCargoAssignmentService.findByCargoId(cargoId);
    }

    @Get('route/:routeId')
    async findByRouteId(
        @Param('routeId', ParseIntPipe) routeId: number,
    ): Promise<VehicleCargoAssignmentResponseDto[]> {
        return await this.vehicleCargoAssignmentService.findByRouteId(routeId);
    }

    @Get(':id')
    async findById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<VehicleCargoAssignmentResponseDto> {
        return await this.vehicleCargoAssignmentService.findById(id);
    }
}
