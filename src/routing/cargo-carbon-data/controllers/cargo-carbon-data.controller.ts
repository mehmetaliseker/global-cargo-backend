import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CargoCarbonDataService } from '../services/cargo-carbon-data.service';
import {
  CargoCarbonDataResponseDto,
  CreateCargoCarbonDataDto,
  UpdateCargoCarbonDataDto,
} from '../dto/cargo-carbon-data.dto';

@Controller('routing/cargo-carbon-data')
export class CargoCarbonDataController {
  constructor(
    private readonly cargoCarbonDataService: CargoCarbonDataService,
  ) {}

  @Get()
  async findAll(): Promise<CargoCarbonDataResponseDto[]> {
    return await this.cargoCarbonDataService.findAll();
  }

  @Get('cargo/:cargoId')
  async findByCargoId(
    @Param('cargoId', ParseIntPipe) cargoId: number,
  ): Promise<CargoCarbonDataResponseDto | null> {
    return await this.cargoCarbonDataService.findByCargoId(cargoId);
  }

  @Get('shipment-type/:shipmentTypeId')
  async findByShipmentTypeId(
    @Param('shipmentTypeId', ParseIntPipe) shipmentTypeId: number,
  ): Promise<CargoCarbonDataResponseDto[]> {
    return await this.cargoCarbonDataService.findByShipmentTypeId(
      shipmentTypeId,
    );
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CargoCarbonDataResponseDto> {
    return await this.cargoCarbonDataService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createDto: CreateCargoCarbonDataDto,
  ): Promise<CargoCarbonDataResponseDto> {
    return await this.cargoCarbonDataService.create(createDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCargoCarbonDataDto,
  ): Promise<CargoCarbonDataResponseDto> {
    return await this.cargoCarbonDataService.update(id, updateDto);
  }
}

