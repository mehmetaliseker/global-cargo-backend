import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CargoEventLogService } from '../services/cargo-event-log.service';
import { CargoEventLogResponseDto } from '../dto/cargo-event-log.dto';

@Controller('cargo/event-logs')
export class CargoEventLogController {
  constructor(private readonly cargoEventLogService: CargoEventLogService) {}

  @Get()
  async findAll(): Promise<CargoEventLogResponseDto[]> {
    return await this.cargoEventLogService.findAll();
  }

  @Get('cargo/:cargoId')
  async findByCargoId(
    @Param('cargoId', ParseIntPipe) cargoId: number,
  ): Promise<CargoEventLogResponseDto[]> {
    return await this.cargoEventLogService.findByCargoId(cargoId);
  }

  @Get('cargo/:cargoId/ordered')
  async findByCargoIdOrdered(
    @Param('cargoId', ParseIntPipe) cargoId: number,
  ): Promise<CargoEventLogResponseDto[]> {
    return await this.cargoEventLogService.findByCargoIdOrdered(cargoId);
  }

  @Get('event-type/:eventType')
  async findByEventType(
    @Param('eventType') eventType: string,
  ): Promise<CargoEventLogResponseDto[]> {
    return await this.cargoEventLogService.findByEventType(eventType);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CargoEventLogResponseDto> {
    return await this.cargoEventLogService.findById(id);
  }
}

