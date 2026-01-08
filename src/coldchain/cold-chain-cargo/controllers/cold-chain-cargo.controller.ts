import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ColdChainCargoService } from '../services/cold-chain-cargo.service';
import { ColdChainCargoResponseDto } from '../dto/cold-chain-cargo.dto';

@Controller('coldchain/cargo')
export class ColdChainCargoController {
    constructor(
        private readonly coldChainCargoService: ColdChainCargoService,
    ) { }

    @Get()
    async findAll(): Promise<ColdChainCargoResponseDto[]> {
        return await this.coldChainCargoService.findAll();
    }

    @Get('monitoring-required')
    async findMonitoringRequired(): Promise<ColdChainCargoResponseDto[]> {
        return await this.coldChainCargoService.findMonitoringRequired();
    }

    @Get('type/:type')
    async findByColdChainType(
        @Param('type') type: string,
    ): Promise<ColdChainCargoResponseDto[]> {
        return await this.coldChainCargoService.findByColdChainType(type);
    }

    @Get('cargo/:cargoId')
    async findByCargoId(
        @Param('cargoId', ParseIntPipe) cargoId: number,
    ): Promise<ColdChainCargoResponseDto> {
        return await this.coldChainCargoService.findByCargoId(cargoId);
    }

    @Get(':id')
    async findById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ColdChainCargoResponseDto> {
        return await this.coldChainCargoService.findById(id);
    }
}
