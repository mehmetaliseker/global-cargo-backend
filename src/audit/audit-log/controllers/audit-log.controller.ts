import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { AuditLogService } from '../services/audit-log.service';
import {
  AuditLogResponseDto,
  AuditLogQueryDto,
} from '../dto/audit-log.dto';

@Controller('audit/logs')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  async query(@Query() queryDto: AuditLogQueryDto): Promise<AuditLogResponseDto[]> {
    return await this.auditLogService.query(queryDto);
  }

  @Get('table/:tableName')
  async findByTableName(
    @Param('tableName') tableName: string,
  ): Promise<AuditLogResponseDto[]> {
    return await this.auditLogService.findByTableName(tableName);
  }

  @Get('table/:tableName/record/:recordId')
  async findByRecordId(
    @Param('tableName') tableName: string,
    @Param('recordId', ParseIntPipe) recordId: number,
  ): Promise<AuditLogResponseDto[]> {
    return await this.auditLogService.findByRecordId(tableName, recordId);
  }

  @Get('table/:tableName/uuid/:recordUuid')
  async findByRecordUuid(
    @Param('tableName') tableName: string,
    @Param('recordUuid') recordUuid: string,
  ): Promise<AuditLogResponseDto[]> {
    return await this.auditLogService.findByRecordUuid(tableName, recordUuid);
  }

  @Get('action/:action')
  async findByAction(
    @Param('action') action: string,
  ): Promise<AuditLogResponseDto[]> {
    return await this.auditLogService.findByAction(action);
  }

  @Get('user/:userId')
  async findByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<AuditLogResponseDto[]> {
    return await this.auditLogService.findByUserId(userId);
  }

  @Get('request/:requestId')
  async findByRequestId(
    @Param('requestId') requestId: string,
  ): Promise<AuditLogResponseDto[]> {
    return await this.auditLogService.findByRequestId(requestId);
  }

  @Get('correlation/:correlationId')
  async findByCorrelationId(
    @Param('correlationId') correlationId: string,
  ): Promise<AuditLogResponseDto[]> {
    return await this.auditLogService.findByCorrelationId(correlationId);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AuditLogResponseDto> {
    return await this.auditLogService.findById(id);
  }
}
