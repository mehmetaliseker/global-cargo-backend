import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { RegionService } from '../services/region.service';
import { RegionResponseDto } from '../dto/region.dto';

@Controller('location/regions')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @Get()
  async findAll(): Promise<RegionResponseDto[]> {
    return await this.regionService.findAll();
  }

  @Get('active')
  async findActive(): Promise<RegionResponseDto[]> {
    return await this.regionService.findActive();
  }

  @Get('country/:countryId')
  async findByCountryId(
    @Param('countryId', ParseIntPipe) countryId: number,
  ): Promise<RegionResponseDto[]> {
    return await this.regionService.findByCountryId(countryId);
  }

  @Get('country/:countryId/active')
  async findByCountryIdAndActive(
    @Param('countryId', ParseIntPipe) countryId: number,
  ): Promise<RegionResponseDto[]> {
    return await this.regionService.findByCountryIdAndActive(countryId);
  }

  @Get('uuid/:uuid')
  async findByUuid(@Param('uuid') uuid: string): Promise<RegionResponseDto> {
    return await this.regionService.findByUuid(uuid);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<RegionResponseDto> {
    return await this.regionService.findById(id);
  }
}

