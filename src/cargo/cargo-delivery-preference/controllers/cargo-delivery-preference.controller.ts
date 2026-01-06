import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CargoDeliveryPreferenceService } from '../services/cargo-delivery-preference.service';
import { CargoDeliveryPreferenceResponseDto } from '../dto/cargo-delivery-preference.dto';

@Controller('cargo/delivery-preferences')
export class CargoDeliveryPreferenceController {
  constructor(
    private readonly cargoDeliveryPreferenceService: CargoDeliveryPreferenceService,
  ) {}

  @Get()
  async findAll(): Promise<CargoDeliveryPreferenceResponseDto[]> {
    return await this.cargoDeliveryPreferenceService.findAll();
  }

  @Get('cargo/:cargoId')
  async findByCargoId(
    @Param('cargoId', ParseIntPipe) cargoId: number,
  ): Promise<CargoDeliveryPreferenceResponseDto[]> {
    return await this.cargoDeliveryPreferenceService.findByCargoId(cargoId);
  }

  @Get('delivery-option/:deliveryOptionId')
  async findByDeliveryOptionId(
    @Param('deliveryOptionId', ParseIntPipe) deliveryOptionId: number,
  ): Promise<CargoDeliveryPreferenceResponseDto[]> {
    return await this.cargoDeliveryPreferenceService.findByDeliveryOptionId(
      deliveryOptionId,
    );
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CargoDeliveryPreferenceResponseDto> {
    return await this.cargoDeliveryPreferenceService.findById(id);
  }
}

