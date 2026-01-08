import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CustomsTaxCalculationService } from '../services/customs-tax-calculation.service';
import {
  CustomsTaxCalculationResponseDto,
  CreateCustomsTaxCalculationDto,
} from '../dto/customs-tax-calculation.dto';

@Controller('customs/tax-calculations')
export class CustomsTaxCalculationController {
  constructor(
    private readonly customsTaxCalculationService: CustomsTaxCalculationService,
  ) {}

  @Get()
  async findAll(): Promise<CustomsTaxCalculationResponseDto[]> {
    return await this.customsTaxCalculationService.findAll();
  }

  @Get('cargo/:cargoId')
  async findByCargoId(
    @Param('cargoId', ParseIntPipe) cargoId: number,
  ): Promise<CustomsTaxCalculationResponseDto[]> {
    return await this.customsTaxCalculationService.findByCargoId(cargoId);
  }

  @Get('cargo/:cargoId/latest')
  async findByCargoIdLatest(
    @Param('cargoId', ParseIntPipe) cargoId: number,
  ): Promise<CustomsTaxCalculationResponseDto | null> {
    return await this.customsTaxCalculationService.findByCargoIdLatest(cargoId);
  }

  @Get('country/:countryId')
  async findByCountryId(
    @Param('countryId', ParseIntPipe) countryId: number,
  ): Promise<CustomsTaxCalculationResponseDto[]> {
    return await this.customsTaxCalculationService.findByCountryId(countryId);
  }

  @Get('country/:countryId/date-range')
  async findByCountryIdAndDateRange(
    @Param('countryId', ParseIntPipe) countryId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<CustomsTaxCalculationResponseDto[]> {
    return await this.customsTaxCalculationService.findByCountryIdAndDateRange(
      countryId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('date-range')
  async findByCalculationDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<CustomsTaxCalculationResponseDto[]> {
    return await this.customsTaxCalculationService.findByCalculationDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('risk-check')
  async findByRiskCheckPassed(
    @Query('passed') passed: string,
  ): Promise<CustomsTaxCalculationResponseDto[]> {
    const riskCheckPassed = passed === 'true';
    return await this.customsTaxCalculationService.findByRiskCheckPassed(
      riskCheckPassed,
    );
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CustomsTaxCalculationResponseDto> {
    return await this.customsTaxCalculationService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createDto: CreateCustomsTaxCalculationDto,
  ): Promise<CustomsTaxCalculationResponseDto> {
    return await this.customsTaxCalculationService.create(createDto);
  }
}

