import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TaxRegulationVersionService } from '../services/tax-regulation-version.service';
import {
  TaxRegulationVersionResponseDto,
  CreateTaxRegulationVersionDto,
  UpdateTaxRegulationVersionDto,
} from '../dto/tax-regulation-version.dto';

@Controller('customs/tax-regulations')
export class TaxRegulationVersionController {
  constructor(
    private readonly taxRegulationVersionService: TaxRegulationVersionService,
  ) {}

  @Get()
  async findAll(): Promise<TaxRegulationVersionResponseDto[]> {
    return await this.taxRegulationVersionService.findAll();
  }

  @Get('country/:countryId')
  async findByCountryId(
    @Param('countryId', ParseIntPipe) countryId: number,
  ): Promise<TaxRegulationVersionResponseDto[]> {
    return await this.taxRegulationVersionService.findByCountryId(countryId);
  }

  @Get('country/:countryId/active')
  async findActiveByCountryId(
    @Param('countryId', ParseIntPipe) countryId: number,
  ): Promise<TaxRegulationVersionResponseDto[]> {
    return await this.taxRegulationVersionService.findActiveByCountryId(
      countryId,
    );
  }

  @Get('country/:countryId/active/date')
  async findActiveByCountryIdAndDate(
    @Param('countryId', ParseIntPipe) countryId: number,
    @Query('date') date: string,
  ): Promise<TaxRegulationVersionResponseDto | null> {
    return await this.taxRegulationVersionService.findActiveByCountryIdAndDate(
      countryId,
      new Date(date),
    );
  }

  @Get('country/:countryId/year/:year')
  async findByCountryIdAndYear(
    @Param('countryId', ParseIntPipe) countryId: number,
    @Param('year', ParseIntPipe) year: number,
  ): Promise<TaxRegulationVersionResponseDto> {
    return await this.taxRegulationVersionService.findByCountryIdAndYear(
      countryId,
      year,
    );
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TaxRegulationVersionResponseDto> {
    return await this.taxRegulationVersionService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createDto: CreateTaxRegulationVersionDto,
  ): Promise<TaxRegulationVersionResponseDto> {
    return await this.taxRegulationVersionService.create(createDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateTaxRegulationVersionDto,
  ): Promise<TaxRegulationVersionResponseDto> {
    return await this.taxRegulationVersionService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.taxRegulationVersionService.delete(id);
  }
}

