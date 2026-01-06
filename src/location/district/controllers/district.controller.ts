import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { DistrictService } from '../services/district.service';
import { DistrictResponseDto } from '../dto/district.dto';

@Controller('location/districts')
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {}

  @Get()
  async findAll(): Promise<DistrictResponseDto[]> {
    return await this.districtService.findAll();
  }

  @Get('active')
  async findActive(): Promise<DistrictResponseDto[]> {
    return await this.districtService.findActive();
  }

  @Get('city/:cityId')
  async findByCityId(
    @Param('cityId', ParseIntPipe) cityId: number,
  ): Promise<DistrictResponseDto[]> {
    return await this.districtService.findByCityId(cityId);
  }

  @Get('city/:cityId/active')
  async findByCityIdAndActive(
    @Param('cityId', ParseIntPipe) cityId: number,
  ): Promise<DistrictResponseDto[]> {
    return await this.districtService.findByCityIdAndActive(cityId);
  }

  @Get('uuid/:uuid')
  async findByUuid(@Param('uuid') uuid: string): Promise<DistrictResponseDto> {
    return await this.districtService.findByUuid(uuid);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DistrictResponseDto> {
    return await this.districtService.findById(id);
  }
}

