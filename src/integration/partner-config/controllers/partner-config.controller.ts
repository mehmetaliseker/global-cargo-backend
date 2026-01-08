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
import { PartnerConfigService } from '../services/partner-config.service';
import {
  PartnerConfigResponseDto,
  CreatePartnerConfigDto,
  UpdatePartnerConfigDto,
} from '../dto/partner-config.dto';

@Controller('integration/partner-configs')
export class PartnerConfigController {
  constructor(
    private readonly partnerConfigService: PartnerConfigService,
  ) {}

  @Get()
  async findAll(): Promise<PartnerConfigResponseDto[]> {
    return await this.partnerConfigService.findAll();
  }

  @Get('active')
  async findActive(): Promise<PartnerConfigResponseDto[]> {
    return await this.partnerConfigService.findActive();
  }

  @Get('partner/:partnerId')
  async findByPartnerId(
    @Param('partnerId', ParseIntPipe) partnerId: number,
  ): Promise<PartnerConfigResponseDto | null> {
    return await this.partnerConfigService.findByPartnerId(partnerId);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PartnerConfigResponseDto> {
    return await this.partnerConfigService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createDto: CreatePartnerConfigDto,
  ): Promise<PartnerConfigResponseDto> {
    return await this.partnerConfigService.create(createDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdatePartnerConfigDto,
  ): Promise<PartnerConfigResponseDto> {
    return await this.partnerConfigService.update(id, updateDto);
  }
}

