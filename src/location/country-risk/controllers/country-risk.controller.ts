import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CountryRiskService } from '../services/country-risk.service';
import { CountryRiskResponseDto } from '../dto/country-risk.dto';

@Controller('location/country-risks')
export class CountryRiskController {
  constructor(private readonly countryRiskService: CountryRiskService) {}

  @Get()
  async findAll(): Promise<CountryRiskResponseDto[]> {
    return await this.countryRiskService.findAll();
  }

  @Get('country/:countryId')
  async findByCountryId(
    @Param('countryId', ParseIntPipe) countryId: number,
  ): Promise<CountryRiskResponseDto> {
    return await this.countryRiskService.findByCountryId(countryId);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CountryRiskResponseDto> {
    return await this.countryRiskService.findById(id);
  }
}

