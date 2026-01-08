import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { LabelTemplateService } from '../services/label-template.service';
import { LabelTemplateResponseDto } from '../dto/label-template.dto';

@Controller('barcode/label-templates')
export class LabelTemplateController {
  constructor(
    private readonly labelTemplateService: LabelTemplateService,
  ) {}

  @Get()
  async findAll(): Promise<LabelTemplateResponseDto[]> {
    return await this.labelTemplateService.findAll();
  }

  @Get('active')
  async findActive(): Promise<LabelTemplateResponseDto[]> {
    return await this.labelTemplateService.findActive();
  }

  @Get('type/:templateType')
  async findByType(
    @Param('templateType') templateType: string,
  ): Promise<LabelTemplateResponseDto[]> {
    return await this.labelTemplateService.findByType(templateType);
  }

  @Get('code/:templateCode')
  async findByCode(
    @Param('templateCode') templateCode: string,
  ): Promise<LabelTemplateResponseDto> {
    return await this.labelTemplateService.findByCode(templateCode);
  }

  @Get('uuid/:uuid')
  async findByUuid(
    @Param('uuid') uuid: string,
  ): Promise<LabelTemplateResponseDto> {
    return await this.labelTemplateService.findByUuid(uuid);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<LabelTemplateResponseDto> {
    return await this.labelTemplateService.findById(id);
  }
}
