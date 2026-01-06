import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { DistributionCenterService } from '../services/distribution-center.service';
import { DistributionCenterResponseDto } from '../dto/distribution-center.dto';

@Controller('location/distribution-centers')
export class DistributionCenterController {
  constructor(
    private readonly distributionCenterService: DistributionCenterService,
  ) {}

  @Get()
  async findAll(): Promise<DistributionCenterResponseDto[]> {
    return await this.distributionCenterService.findAll();
  }

  @Get('active')
  async findActive(): Promise<DistributionCenterResponseDto[]> {
    return await this.distributionCenterService.findActive();
  }

  @Get('transfer-points')
  async findTransferPoints(): Promise<DistributionCenterResponseDto[]> {
    return await this.distributionCenterService.findTransferPoints();
  }

  @Get('country/:countryId')
  async findByCountryId(
    @Param('countryId', ParseIntPipe) countryId: number,
  ): Promise<DistributionCenterResponseDto[]> {
    return await this.distributionCenterService.findByCountryId(countryId);
  }

  @Get('country/:countryId/active')
  async findByCountryIdAndActive(
    @Param('countryId', ParseIntPipe) countryId: number,
  ): Promise<DistributionCenterResponseDto[]> {
    return await this.distributionCenterService.findByCountryIdAndActive(
      countryId,
    );
  }

  @Get('city/:cityId')
  async findByCityId(
    @Param('cityId', ParseIntPipe) cityId: number,
  ): Promise<DistributionCenterResponseDto[]> {
    return await this.distributionCenterService.findByCityId(cityId);
  }

  @Get('uuid/:uuid')
  async findByUuid(
    @Param('uuid') uuid: string,
  ): Promise<DistributionCenterResponseDto> {
    return await this.distributionCenterService.findByUuid(uuid);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DistributionCenterResponseDto> {
    return await this.distributionCenterService.findById(id);
  }
}

