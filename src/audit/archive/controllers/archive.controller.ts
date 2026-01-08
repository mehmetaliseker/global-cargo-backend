import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ArchiveService } from '../services/archive.service';
import {
  ArchiveResponseDto,
  ArchiveQueryDto,
} from '../dto/archive.dto';

@Controller('audit/archives')
export class ArchiveController {
  constructor(private readonly archiveService: ArchiveService) {}

  @Get()
  async query(@Query() queryDto: ArchiveQueryDto): Promise<ArchiveResponseDto[]> {
    return await this.archiveService.query(queryDto);
  }

  @Get('table/:sourceTableName')
  async findBySourceTable(
    @Param('sourceTableName') sourceTableName: string,
  ): Promise<ArchiveResponseDto[]> {
    return await this.archiveService.findBySourceTable(sourceTableName);
  }

  @Get('table/:sourceTableName/record/:sourceRecordId')
  async findBySourceRecord(
    @Param('sourceTableName') sourceTableName: string,
    @Param('sourceRecordId', ParseIntPipe) sourceRecordId: number,
  ): Promise<ArchiveResponseDto[]> {
    return await this.archiveService.findBySourceRecord(
      sourceTableName,
      sourceRecordId,
    );
  }

  @Get('table/:sourceTableName/uuid/:sourceRecordUuid')
  async findBySourceRecordUuid(
    @Param('sourceTableName') sourceTableName: string,
    @Param('sourceRecordUuid') sourceRecordUuid: string,
  ): Promise<ArchiveResponseDto[]> {
    return await this.archiveService.findBySourceRecordUuid(
      sourceTableName,
      sourceRecordUuid,
    );
  }

  @Get('type/:archiveType')
  async findByArchiveType(
    @Param('archiveType') archiveType: string,
  ): Promise<ArchiveResponseDto[]> {
    return await this.archiveService.findByArchiveType(archiveType);
  }

  @Get('archived-by/:employeeId')
  async findByArchivedBy(
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ): Promise<ArchiveResponseDto[]> {
    return await this.archiveService.findByArchivedBy(employeeId);
  }

  @Get('uuid/:uuid')
  async findByUuid(@Param('uuid') uuid: string): Promise<ArchiveResponseDto> {
    return await this.archiveService.findByUuid(uuid);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ArchiveResponseDto> {
    return await this.archiveService.findById(id);
  }
}
