import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CargoTypeService } from '../services/cargo-type.service';
import { CargoTypeResponseDto } from '../dto/cargo-type.dto';

@Controller('lookup/cargo-types')
export class CargoTypeController {
  constructor(private readonly cargoTypeService: CargoTypeService) {}

  @Get()
  async findAll(): Promise<CargoTypeResponseDto[]> {
    return await this.cargoTypeService.findAll();
  }

  @Get('active')
  async findActive(): Promise<CargoTypeResponseDto[]> {
    return await this.cargoTypeService.findActive();
  }

  @Get('code/:code')
  async findByCode(@Param('code') code: string): Promise<CargoTypeResponseDto> {
    return await this.cargoTypeService.findByCode(code);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CargoTypeResponseDto> {
    return await this.cargoTypeService.findById(id);
  }
}

