import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CargoStateHistoryService } from '../services/cargo-state-history.service';
import { CargoStateHistoryResponseDto } from '../dto/cargo-state-history.dto';

@Controller('cargo/state-history')
export class CargoStateHistoryController {
  constructor(
    private readonly cargoStateHistoryService: CargoStateHistoryService,
  ) {}

  @Get()
  async findAll(): Promise<CargoStateHistoryResponseDto[]> {
    return await this.cargoStateHistoryService.findAll();
  }

  @Get('cargo/:cargoId')
  async findByCargoId(
    @Param('cargoId', ParseIntPipe) cargoId: number,
  ): Promise<CargoStateHistoryResponseDto[]> {
    return await this.cargoStateHistoryService.findByCargoId(cargoId);
  }

  @Get('cargo/:cargoId/ordered')
  async findByCargoIdOrdered(
    @Param('cargoId', ParseIntPipe) cargoId: number,
  ): Promise<CargoStateHistoryResponseDto[]> {
    return await this.cargoStateHistoryService.findByCargoIdOrdered(cargoId);
  }

  @Get('state/:stateId')
  async findByStateId(
    @Param('stateId', ParseIntPipe) stateId: number,
  ): Promise<CargoStateHistoryResponseDto[]> {
    return await this.cargoStateHistoryService.findByStateId(stateId);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CargoStateHistoryResponseDto> {
    return await this.cargoStateHistoryService.findById(id);
  }
}

