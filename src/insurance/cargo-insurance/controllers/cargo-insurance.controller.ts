import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CargoInsuranceService } from '../services/cargo-insurance.service';
import {
  CargoInsuranceResponseDto,
  CreateCargoInsuranceDto,
} from '../dto/cargo-insurance.dto';

@Controller('insurance/cargo')
export class CargoInsuranceController {
  constructor(
    private readonly cargoInsuranceService: CargoInsuranceService,
  ) {}

  @Get()
  async findAll(): Promise<CargoInsuranceResponseDto[]> {
    return await this.cargoInsuranceService.findAll();
  }

  @Get('active')
  async findActive(): Promise<CargoInsuranceResponseDto[]> {
    return await this.cargoInsuranceService.findActive();
  }

  @Get('status')
  async findByActiveStatus(
    @Query('active') active: string,
  ): Promise<CargoInsuranceResponseDto[]> {
    const isActive = active === 'true';
    return await this.cargoInsuranceService.findByActiveStatus(isActive);
  }

  @Get('cargo/:cargoId')
  async findByCargoId(
    @Param('cargoId', ParseIntPipe) cargoId: number,
  ): Promise<CargoInsuranceResponseDto | null> {
    return await this.cargoInsuranceService.findByCargoId(cargoId);
  }

  @Get('policy/:policyNumber')
  async findByPolicyNumber(
    @Param('policyNumber') policyNumber: string,
  ): Promise<CargoInsuranceResponseDto> {
    return await this.cargoInsuranceService.findByPolicyNumber(policyNumber);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CargoInsuranceResponseDto> {
    return await this.cargoInsuranceService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createDto: CreateCargoInsuranceDto,
  ): Promise<CargoInsuranceResponseDto> {
    return await this.cargoInsuranceService.create(createDto);
  }

  // Migration 014: UPDATE and ACTIVATE operations disabled
  // cargo_insurance records are immutable per database trigger constraints
  // @Put(':id') endpoint removed
  // @Put(':id/activate') endpoint removed
}

