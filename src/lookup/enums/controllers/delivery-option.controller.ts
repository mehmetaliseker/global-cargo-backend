import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { DeliveryOptionService } from '../services/delivery-option.service';
import { DeliveryOptionResponseDto } from '../dto/delivery-option.dto';

@Controller('lookup/delivery-options')
export class DeliveryOptionController {
  constructor(
    private readonly deliveryOptionService: DeliveryOptionService,
  ) {}

  @Get()
  async findAll(): Promise<DeliveryOptionResponseDto[]> {
    return await this.deliveryOptionService.findAll();
  }

  @Get('active')
  async findActive(): Promise<DeliveryOptionResponseDto[]> {
    return await this.deliveryOptionService.findActive();
  }

  @Get('code/:code')
  async findByCode(
    @Param('code') code: string,
  ): Promise<DeliveryOptionResponseDto> {
    return await this.deliveryOptionService.findByCode(code);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeliveryOptionResponseDto> {
    return await this.deliveryOptionService.findById(id);
  }
}

