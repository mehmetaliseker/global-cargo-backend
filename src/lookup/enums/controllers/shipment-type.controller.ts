import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ShipmentTypeService } from '../services/shipment-type.service';
import { ShipmentTypeResponseDto } from '../dto/shipment-type.dto';

@Controller('lookup/shipment-types')
export class ShipmentTypeController {
  constructor(
    private readonly shipmentTypeService: ShipmentTypeService,
  ) {}

  @Get()
  async findAll(): Promise<ShipmentTypeResponseDto[]> {
    return await this.shipmentTypeService.findAll();
  }

  @Get('active')
  async findActive(): Promise<ShipmentTypeResponseDto[]> {
    return await this.shipmentTypeService.findActive();
  }

  @Get('code/:code')
  async findByCode(
    @Param('code') code: string,
  ): Promise<ShipmentTypeResponseDto> {
    return await this.shipmentTypeService.findByCode(code);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ShipmentTypeResponseDto> {
    return await this.shipmentTypeService.findById(id);
  }
}

