import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CargoReturnRequestService } from '../services/cargo-return-request.service';
import { CargoReturnRequestResponseDto } from '../dto/cargo-return-request.dto';

@Controller('cargo/return-requests')
export class CargoReturnRequestController {
  constructor(
    private readonly cargoReturnRequestService: CargoReturnRequestService,
  ) {}

  @Get()
  async findAll(): Promise<CargoReturnRequestResponseDto[]> {
    return await this.cargoReturnRequestService.findAll();
  }

  @Get('cargo/:cargoId')
  async findByCargoId(
    @Param('cargoId', ParseIntPipe) cargoId: number,
  ): Promise<CargoReturnRequestResponseDto> {
    return await this.cargoReturnRequestService.findByCargoId(cargoId);
  }

  @Get('status/:status')
  async findByStatus(
    @Param('status') status: string,
  ): Promise<CargoReturnRequestResponseDto[]> {
    return await this.cargoReturnRequestService.findByStatus(status);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CargoReturnRequestResponseDto> {
    return await this.cargoReturnRequestService.findById(id);
  }
}

