import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PartnerService } from '../services/partner.service';
import { PartnerResponseDto } from '../dto/partner.dto';

@Controller('actors/partners')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Get()
  async findAll(): Promise<PartnerResponseDto[]> {
    return await this.partnerService.findAll();
  }

  @Get('active')
  async findActive(): Promise<PartnerResponseDto[]> {
    return await this.partnerService.findActive();
  }

  @Get('api-active')
  async findApiActive(): Promise<PartnerResponseDto[]> {
    return await this.partnerService.findApiActive();
  }

  @Get('country/:countryId')
  async findByCountryId(
    @Param('countryId', ParseIntPipe) countryId: number,
  ): Promise<PartnerResponseDto[]> {
    return await this.partnerService.findByCountryId(countryId);
  }

  @Get('country/:countryId/active')
  async findByCountryIdAndActive(
    @Param('countryId', ParseIntPipe) countryId: number,
  ): Promise<PartnerResponseDto[]> {
    return await this.partnerService.findByCountryIdAndActive(countryId);
  }

  @Get('actor/:actorId')
  async findByActorId(
    @Param('actorId', ParseIntPipe) actorId: number,
  ): Promise<PartnerResponseDto> {
    return await this.partnerService.findByActorId(actorId);
  }

  @Get('uuid/:uuid')
  async findByUuid(@Param('uuid') uuid: string): Promise<PartnerResponseDto> {
    return await this.partnerService.findByUuid(uuid);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PartnerResponseDto> {
    return await this.partnerService.findById(id);
  }
}

