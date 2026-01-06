import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CountryService } from '../services/country.service';
import { CountryResponseDto } from '../dto/country.dto';

@Controller('location/countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  async findAll(): Promise<CountryResponseDto[]> {
    return await this.countryService.findAll();
  }

  @Get('active')
  async findActive(): Promise<CountryResponseDto[]> {
    return await this.countryService.findActive();
  }

  @Get('iso-code/:isoCode')
  async findByIsoCode(
    @Param('isoCode') isoCode: string,
  ): Promise<CountryResponseDto> {
    return await this.countryService.findByIsoCode(isoCode);
  }

  @Get('iso-code-2/:isoCode2')
  async findByIsoCode2(
    @Param('isoCode2') isoCode2: string,
  ): Promise<CountryResponseDto> {
    return await this.countryService.findByIsoCode2(isoCode2);
  }

  @Get('uuid/:uuid')
  async findByUuid(@Param('uuid') uuid: string): Promise<CountryResponseDto> {
    return await this.countryService.findByUuid(uuid);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CountryResponseDto> {
    return await this.countryService.findById(id);
  }
}

