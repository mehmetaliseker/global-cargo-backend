import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CityService } from '../services/city.service';
import { CityResponseDto } from '../dto/city.dto';

@Controller('location/cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get()
  async findAll(): Promise<CityResponseDto[]> {
    return await this.cityService.findAll();
  }

  @Get('active')
  async findActive(): Promise<CityResponseDto[]> {
    return await this.cityService.findActive();
  }

  @Get('region/:regionId')
  async findByRegionId(
    @Param('regionId', ParseIntPipe) regionId: number,
  ): Promise<CityResponseDto[]> {
    return await this.cityService.findByRegionId(regionId);
  }

  @Get('region/:regionId/active')
  async findByRegionIdAndActive(
    @Param('regionId', ParseIntPipe) regionId: number,
  ): Promise<CityResponseDto[]> {
    return await this.cityService.findByRegionIdAndActive(regionId);
  }

  @Get('uuid/:uuid')
  async findByUuid(@Param('uuid') uuid: string): Promise<CityResponseDto> {
    return await this.cityService.findByUuid(uuid);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CityResponseDto> {
    return await this.cityService.findById(id);
  }
}

