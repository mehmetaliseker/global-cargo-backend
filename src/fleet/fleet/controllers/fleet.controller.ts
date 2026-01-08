import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { FleetService } from '../services/fleet.service';
import { FleetResponseDto } from '../dto/fleet.dto';

@Controller('fleet')
export class FleetController {
    constructor(private readonly fleetService: FleetService) { }

    @Get()
    async findAll(): Promise<FleetResponseDto[]> {
        return await this.fleetService.findAll();
    }

    @Get('active')
    async findActive(): Promise<FleetResponseDto[]> {
        return await this.fleetService.findActive();
    }

    @Get('code/:fleetCode')
    async findByFleetCode(
        @Param('fleetCode') fleetCode: string,
    ): Promise<FleetResponseDto> {
        return await this.fleetService.findByFleetCode(fleetCode);
    }

    @Get(':id')
    async findById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<FleetResponseDto> {
        return await this.fleetService.findById(id);
    }
}
