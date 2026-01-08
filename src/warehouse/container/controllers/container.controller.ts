import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ContainerService } from '../services/container.service';
import { ContainerResponseDto } from '../dto/container.dto';

@Controller('warehouse/containers')
export class ContainerController {
    constructor(private readonly containerService: ContainerService) { }

    @Get()
    async findAll(): Promise<ContainerResponseDto[]> {
        return await this.containerService.findAll();
    }

    @Get('active')
    async findActive(): Promise<ContainerResponseDto[]> {
        return await this.containerService.findActive();
    }

    @Get('in-use')
    async findInUse(): Promise<ContainerResponseDto[]> {
        return await this.containerService.findInUse();
    }

    @Get('warehouse/:warehouseId')
    async findByWarehouseId(
        @Param('warehouseId', ParseIntPipe) warehouseId: number,
    ): Promise<ContainerResponseDto[]> {
        return await this.containerService.findByWarehouseId(warehouseId);
    }

    @Get('code/:containerCode')
    async findByContainerCode(
        @Param('containerCode') containerCode: string,
    ): Promise<ContainerResponseDto> {
        return await this.containerService.findByContainerCode(containerCode);
    }

    @Get('uuid/:uuid')
    async findByUuid(@Param('uuid') uuid: string): Promise<ContainerResponseDto> {
        return await this.containerService.findByUuid(uuid);
    }

    @Get(':id')
    async findById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ContainerResponseDto> {
        return await this.containerService.findById(id);
    }
}
