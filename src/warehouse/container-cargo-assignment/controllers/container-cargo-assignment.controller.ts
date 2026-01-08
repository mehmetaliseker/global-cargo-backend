import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ContainerCargoAssignmentService } from '../services/container-cargo-assignment.service';
import { ContainerCargoAssignmentResponseDto } from '../dto/container-cargo-assignment.dto';

@Controller('warehouse/container-cargo-assignments')
export class ContainerCargoAssignmentController {
    constructor(
        private readonly containerCargoAssignmentService: ContainerCargoAssignmentService,
    ) { }

    @Get()
    async findAll(): Promise<ContainerCargoAssignmentResponseDto[]> {
        return await this.containerCargoAssignmentService.findAll();
    }

    @Get('container/:containerId')
    async findByContainerId(
        @Param('containerId', ParseIntPipe) containerId: number,
    ): Promise<ContainerCargoAssignmentResponseDto[]> {
        return await this.containerCargoAssignmentService.findByContainerId(
            containerId,
        );
    }

    @Get('cargo/:cargoId')
    async findByCargoId(
        @Param('cargoId', ParseIntPipe) cargoId: number,
    ): Promise<ContainerCargoAssignmentResponseDto[]> {
        return await this.containerCargoAssignmentService.findByCargoId(cargoId);
    }

    @Get(':id')
    async findById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ContainerCargoAssignmentResponseDto> {
        return await this.containerCargoAssignmentService.findById(id);
    }
}
