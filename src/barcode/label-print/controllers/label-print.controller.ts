import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { LabelConfigurationService } from '../services/label-print.service';
import { LabelPrintHistoryService } from '../services/label-print.service';
import {
  LabelConfigurationResponseDto,
  LabelPrintHistoryResponseDto,
} from '../dto/label-print.dto';

@Controller('barcode/label-configurations')
export class LabelConfigurationController {
  constructor(
    private readonly labelConfigurationService: LabelConfigurationService,
  ) {}

  @Get()
  async findAll(): Promise<LabelConfigurationResponseDto[]> {
    return await this.labelConfigurationService.findAll();
  }

  @Get('template/:labelTemplateId')
  async findByLabelTemplateId(
    @Param('labelTemplateId', ParseIntPipe) labelTemplateId: number,
  ): Promise<LabelConfigurationResponseDto[]> {
    return await this.labelConfigurationService.findByLabelTemplateId(
      labelTemplateId,
    );
  }

  @Get('cargo/:cargoId')
  async findByCargoId(
    @Param('cargoId', ParseIntPipe) cargoId: number,
  ): Promise<LabelConfigurationResponseDto[]> {
    return await this.labelConfigurationService.findByCargoId(cargoId);
  }

  @Get('uuid/:uuid')
  async findByUuid(
    @Param('uuid') uuid: string,
  ): Promise<LabelConfigurationResponseDto> {
    return await this.labelConfigurationService.findByUuid(uuid);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<LabelConfigurationResponseDto> {
    return await this.labelConfigurationService.findById(id);
  }
}

@Controller('barcode/label-print-history')
export class LabelPrintHistoryController {
  constructor(
    private readonly labelPrintHistoryService: LabelPrintHistoryService,
  ) {}

  @Get()
  async findAll(): Promise<LabelPrintHistoryResponseDto[]> {
    return await this.labelPrintHistoryService.findAll();
  }

  @Get('failed')
  async findFailed(): Promise<LabelPrintHistoryResponseDto[]> {
    return await this.labelPrintHistoryService.findFailed();
  }

  @Get('successful')
  async findSuccessful(): Promise<LabelPrintHistoryResponseDto[]> {
    return await this.labelPrintHistoryService.findSuccessful();
  }

  @Get('status/:printStatus')
  async findByPrintStatus(
    @Param('printStatus') printStatus: string,
  ): Promise<LabelPrintHistoryResponseDto[]> {
    return await this.labelPrintHistoryService.findByPrintStatus(printStatus);
  }

  @Get('configuration/:labelConfigurationId')
  async findByLabelConfigurationId(
    @Param('labelConfigurationId', ParseIntPipe)
    labelConfigurationId: number,
  ): Promise<LabelPrintHistoryResponseDto[]> {
    return await this.labelPrintHistoryService.findByLabelConfigurationId(
      labelConfigurationId,
    );
  }

  @Get('date-range')
  async findByPrintDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<LabelPrintHistoryResponseDto[]> {
    return await this.labelPrintHistoryService.findByPrintDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<LabelPrintHistoryResponseDto> {
    return await this.labelPrintHistoryService.findById(id);
  }
}
