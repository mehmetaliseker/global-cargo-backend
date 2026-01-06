import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { CargoService } from '../services/cargo.service';
import { CargoResponseDto } from '../dto/cargo.dto';

@Controller('cargo')
export class CargoController {
  constructor(private readonly cargoService: CargoService) {}

  @Get()
  async findAll(): Promise<CargoResponseDto[]> {
    return await this.cargoService.findAll();
  }

  @Get('tracking/:trackingNumber')
  async findByTrackingNumber(
    @Param('trackingNumber') trackingNumber: string,
  ): Promise<CargoResponseDto> {
    return await this.cargoService.findByTrackingNumber(trackingNumber);
  }

  @Get('delivery/:deliveryNumber')
  async findByDeliveryNumber(
    @Param('deliveryNumber') deliveryNumber: string,
  ): Promise<CargoResponseDto> {
    return await this.cargoService.findByDeliveryNumber(deliveryNumber);
  }

  @Get('customer/:customerId')
  async findByCustomerId(
    @Param('customerId', ParseIntPipe) customerId: number,
  ): Promise<CargoResponseDto[]> {
    return await this.cargoService.findByCustomerId(customerId);
  }

  @Get('origin-country/:originCountryId')
  async findByOriginCountryId(
    @Param('originCountryId', ParseIntPipe) originCountryId: number,
  ): Promise<CargoResponseDto[]> {
    return await this.cargoService.findByOriginCountryId(originCountryId);
  }

  @Get('destination-country/:destinationCountryId')
  async findByDestinationCountryId(
    @Param('destinationCountryId', ParseIntPipe) destinationCountryId: number,
  ): Promise<CargoResponseDto[]> {
    return await this.cargoService.findByDestinationCountryId(
      destinationCountryId,
    );
  }

  @Get('state/:stateId')
  async findByCurrentStateId(
    @Param('stateId', ParseIntPipe) stateId: number,
  ): Promise<CargoResponseDto[]> {
    return await this.cargoService.findByCurrentStateId(stateId);
  }

  @Get('estimated-delivery')
  async findByEstimatedDeliveryDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<CargoResponseDto[]> {
    return await this.cargoService.findByEstimatedDeliveryDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('uuid/:uuid')
  async findByUuid(@Param('uuid') uuid: string): Promise<CargoResponseDto> {
    return await this.cargoService.findByUuid(uuid);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CargoResponseDto> {
    return await this.cargoService.findById(id);
  }
}

