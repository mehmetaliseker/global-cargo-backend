import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PartnerCountryMappingService } from '../services/partner-country-mapping.service';
import {
  PartnerCountryMappingResponseDto,
  CreatePartnerCountryMappingDto,
  UpdatePartnerCountryMappingDto,
} from '../dto/partner-country-mapping.dto';

@Controller('integration/partner-country-mappings')
export class PartnerCountryMappingController {
  constructor(
    private readonly partnerCountryMappingService: PartnerCountryMappingService,
  ) {}

  @Get()
  async findAll(): Promise<PartnerCountryMappingResponseDto[]> {
    return await this.partnerCountryMappingService.findAll();
  }

  @Get('active')
  async findActive(): Promise<PartnerCountryMappingResponseDto[]> {
    return await this.partnerCountryMappingService.findActive();
  }

  @Get('partner/:partnerId')
  async findByPartnerId(
    @Param('partnerId', ParseIntPipe) partnerId: number,
  ): Promise<PartnerCountryMappingResponseDto[]> {
    return await this.partnerCountryMappingService.findByPartnerId(partnerId);
  }

  @Get('partner/:partnerId/active')
  async findByPartnerIdActive(
    @Param('partnerId', ParseIntPipe) partnerId: number,
  ): Promise<PartnerCountryMappingResponseDto[]> {
    return await this.partnerCountryMappingService.findByPartnerIdActive(
      partnerId,
    );
  }

  @Get('country/:countryId')
  async findByCountryId(
    @Param('countryId', ParseIntPipe) countryId: number,
  ): Promise<PartnerCountryMappingResponseDto[]> {
    return await this.partnerCountryMappingService.findByCountryId(countryId);
  }

  @Get('partner/:partnerId/country/:countryId')
  async findByPartnerIdAndCountryId(
    @Param('partnerId', ParseIntPipe) partnerId: number,
    @Param('countryId', ParseIntPipe) countryId: number,
  ): Promise<PartnerCountryMappingResponseDto | null> {
    return await this.partnerCountryMappingService.findByPartnerIdAndCountryId(
      partnerId,
      countryId,
    );
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PartnerCountryMappingResponseDto> {
    return await this.partnerCountryMappingService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createDto: CreatePartnerCountryMappingDto,
  ): Promise<PartnerCountryMappingResponseDto> {
    return await this.partnerCountryMappingService.create(createDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdatePartnerCountryMappingDto,
  ): Promise<PartnerCountryMappingResponseDto> {
    return await this.partnerCountryMappingService.update(id, updateDto);
  }
}

