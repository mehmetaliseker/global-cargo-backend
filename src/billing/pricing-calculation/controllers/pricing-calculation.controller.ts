import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PricingCalculationService } from '../services/pricing-calculation.service';
import { PricingCalculationResponseDto } from '../dto/pricing-calculation.dto';

@Controller('billing/pricing-calculations')
export class PricingCalculationController {
  constructor(
    private readonly pricingCalculationService: PricingCalculationService,
  ) {}

  @Get()
  async findAll(): Promise<PricingCalculationResponseDto[]> {
    return await this.pricingCalculationService.findAll();
  }

  @Get('cargo/:cargoId')
  async findByCargoId(
    @Param('cargoId', ParseIntPipe) cargoId: number,
  ): Promise<PricingCalculationResponseDto[]> {
    return await this.pricingCalculationService.findByCargoId(cargoId);
  }

  @Get('cargo/:cargoId/latest')
  async findByCargoIdLatest(
    @Param('cargoId', ParseIntPipe) cargoId: number,
  ): Promise<PricingCalculationResponseDto> {
    return await this.pricingCalculationService.findByCargoIdLatest(cargoId);
  }

  @Get('uuid/:uuid')
  async findByUuid(
    @Param('uuid') uuid: string,
  ): Promise<PricingCalculationResponseDto> {
    return await this.pricingCalculationService.findByUuid(uuid);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PricingCalculationResponseDto> {
    return await this.pricingCalculationService.findById(id);
  }
}

