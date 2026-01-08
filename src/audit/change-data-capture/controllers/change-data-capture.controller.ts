import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  ParseBoolPipe,
} from '@nestjs/common';
import { ChangeDataCaptureService } from '../services/change-data-capture.service';
import {
  ChangeDataCaptureResponseDto,
  ChangeDataCaptureQueryDto,
} from '../dto/change-data-capture.dto';

@Controller('audit/change-data-capture')
export class ChangeDataCaptureController {
  constructor(
    private readonly changeDataCaptureService: ChangeDataCaptureService,
  ) {}

  @Get()
  async query(
    @Query() queryDto: ChangeDataCaptureQueryDto,
  ): Promise<ChangeDataCaptureResponseDto[]> {
    return await this.changeDataCaptureService.query(queryDto);
  }

  @Get('unprocessed')
  async findUnprocessed(): Promise<ChangeDataCaptureResponseDto[]> {
    return await this.changeDataCaptureService.findUnprocessed();
  }

  @Get('processed/:processed')
  async findByProcessed(
    @Param('processed', ParseBoolPipe) processed: boolean,
  ): Promise<ChangeDataCaptureResponseDto[]> {
    return await this.changeDataCaptureService.findByProcessed(processed);
  }

  @Get('table/:sourceTable')
  async findBySourceTable(
    @Param('sourceTable') sourceTable: string,
  ): Promise<ChangeDataCaptureResponseDto[]> {
    return await this.changeDataCaptureService.findBySourceTable(sourceTable);
  }

  @Get('table/:sourceTable/record/:sourceRecordId')
  async findBySourceRecord(
    @Param('sourceTable') sourceTable: string,
    @Param('sourceRecordId', ParseIntPipe) sourceRecordId: number,
  ): Promise<ChangeDataCaptureResponseDto[]> {
    return await this.changeDataCaptureService.findBySourceRecord(
      sourceTable,
      sourceRecordId,
    );
  }

  @Get('table/:sourceTable/uuid/:sourceRecordUuid')
  async findBySourceRecordUuid(
    @Param('sourceTable') sourceTable: string,
    @Param('sourceRecordUuid') sourceRecordUuid: string,
  ): Promise<ChangeDataCaptureResponseDto[]> {
    return await this.changeDataCaptureService.findBySourceRecordUuid(
      sourceTable,
      sourceRecordUuid,
    );
  }

  @Get('change-type/:changeType')
  async findByChangeType(
    @Param('changeType') changeType: string,
  ): Promise<ChangeDataCaptureResponseDto[]> {
    return await this.changeDataCaptureService.findByChangeType(changeType);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ChangeDataCaptureResponseDto> {
    return await this.changeDataCaptureService.findById(id);
  }
}
