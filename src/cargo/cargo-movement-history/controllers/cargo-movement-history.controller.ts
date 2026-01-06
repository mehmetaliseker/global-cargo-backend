import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CargoMovementHistoryService } from '../services/cargo-movement-history.service';
import { CargoMovementHistoryResponseDto } from '../dto/cargo-movement-history.dto';

@Controller('cargo/movement-history')
export class CargoMovementHistoryController {
  constructor(
    private readonly cargoMovementHistoryService: CargoMovementHistoryService,
  ) {}

  @Get()
  async findAll(): Promise<CargoMovementHistoryResponseDto[]> {
    return await this.cargoMovementHistoryService.findAll();
  }

  @Get('cargo/:cargoId')
  async findByCargoId(
    @Param('cargoId', ParseIntPipe) cargoId: number,
  ): Promise<CargoMovementHistoryResponseDto[]> {
    return await this.cargoMovementHistoryService.findByCargoId(cargoId);
  }

  @Get('cargo/:cargoId/ordered')
  async findByCargoIdOrdered(
    @Param('cargoId', ParseIntPipe) cargoId: number,
  ): Promise<CargoMovementHistoryResponseDto[]> {
    return await this.cargoMovementHistoryService.findByCargoIdOrdered(cargoId);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CargoMovementHistoryResponseDto> {
    return await this.cargoMovementHistoryService.findById(id);
  }
}

