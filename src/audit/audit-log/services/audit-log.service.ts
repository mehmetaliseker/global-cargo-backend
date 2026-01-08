import { Injectable, BadRequestException } from '@nestjs/common';
import { AuditLogRepository } from '../repositories/audit-log.repository';
import {
  AuditLogResponseDto,
  AuditLogQueryDto,
} from '../dto/audit-log.dto';
import { AuditLogEntity } from '../repositories/audit-log.repository.interface';

@Injectable()
export class AuditLogService {
  constructor(private readonly auditLogRepository: AuditLogRepository) {}

  private mapToDto(entity: AuditLogEntity): AuditLogResponseDto {
    let oldValues: Record<string, unknown> | undefined;
    if (entity.old_values) {
      if (typeof entity.old_values === 'string') {
        oldValues = JSON.parse(entity.old_values);
      } else {
        oldValues = entity.old_values as Record<string, unknown>;
      }
    }

    let newValues: Record<string, unknown> | undefined;
    if (entity.new_values) {
      if (typeof entity.new_values === 'string') {
        newValues = JSON.parse(entity.new_values);
      } else {
        newValues = entity.new_values as Record<string, unknown>;
      }
    }

    return {
      id: entity.id,
      tableName: entity.table_name,
      recordId: entity.record_id,
      recordUuid: entity.record_uuid ?? undefined,
      action: entity.action,
      oldValues,
      newValues,
      userId: entity.user_id ?? undefined,
      userType: entity.user_type ?? undefined,
      serviceName: entity.service_name ?? undefined,
      requestId: entity.request_id ?? undefined,
      correlationId: entity.correlation_id ?? undefined,
      ipAddress: entity.ip_address ?? undefined,
      userAgent: entity.user_agent ?? undefined,
      timestamp: entity.timestamp.toISOString(),
      createdAt: entity.created_at.toISOString(),
    };
  }

  async findAll(): Promise<AuditLogResponseDto[]> {
    const entities = await this.auditLogRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<AuditLogResponseDto> {
    const entity = await this.auditLogRepository.findById(id);
    if (!entity) {
      throw new BadRequestException(`Audit log with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByTableName(tableName: string): Promise<AuditLogResponseDto[]> {
    const entities = await this.auditLogRepository.findByTableName(tableName);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByRecordId(
    tableName: string,
    recordId: number,
  ): Promise<AuditLogResponseDto[]> {
    const entities = await this.auditLogRepository.findByRecordId(
      tableName,
      recordId,
    );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByRecordUuid(
    tableName: string,
    recordUuid: string,
  ): Promise<AuditLogResponseDto[]> {
    const entities = await this.auditLogRepository.findByRecordUuid(
      tableName,
      recordUuid,
    );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByAction(action: string): Promise<AuditLogResponseDto[]> {
    const entities = await this.auditLogRepository.findByAction(action);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByUserId(userId: number): Promise<AuditLogResponseDto[]> {
    const entities = await this.auditLogRepository.findByUserId(userId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByRequestId(requestId: string): Promise<AuditLogResponseDto[]> {
    const entities = await this.auditLogRepository.findByRequestId(requestId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByCorrelationId(
    correlationId: string,
  ): Promise<AuditLogResponseDto[]> {
    const entities =
      await this.auditLogRepository.findByCorrelationId(correlationId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<AuditLogResponseDto[]> {
    if (startDate > endDate) {
      throw new BadRequestException('Start date must be before end date');
    }
    const entities = await this.auditLogRepository.findByDateRange(
      startDate,
      endDate,
    );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByTableAndDateRange(
    tableName: string,
    startDate: Date,
    endDate: Date,
  ): Promise<AuditLogResponseDto[]> {
    if (startDate > endDate) {
      throw new BadRequestException('Start date must be before end date');
    }
    const entities = await this.auditLogRepository.findByTableAndDateRange(
      tableName,
      startDate,
      endDate,
    );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async query(queryDto: AuditLogQueryDto): Promise<AuditLogResponseDto[]> {
    if (queryDto.tableName && queryDto.recordId) {
      return await this.findByRecordId(queryDto.tableName, queryDto.recordId);
    }
    if (queryDto.tableName && queryDto.recordUuid) {
      return await this.findByRecordUuid(queryDto.tableName, queryDto.recordUuid);
    }
    if (queryDto.tableName && queryDto.startDate && queryDto.endDate) {
      return await this.findByTableAndDateRange(
        queryDto.tableName,
        new Date(queryDto.startDate),
        new Date(queryDto.endDate),
      );
    }
    if (queryDto.startDate && queryDto.endDate) {
      return await this.findByDateRange(
        new Date(queryDto.startDate),
        new Date(queryDto.endDate),
      );
    }
    if (queryDto.tableName) {
      return await this.findByTableName(queryDto.tableName);
    }
    if (queryDto.action) {
      return await this.findByAction(queryDto.action);
    }
    if (queryDto.userId) {
      return await this.findByUserId(queryDto.userId);
    }
    if (queryDto.requestId) {
      return await this.findByRequestId(queryDto.requestId);
    }
    if (queryDto.correlationId) {
      return await this.findByCorrelationId(queryDto.correlationId);
    }
    return await this.findAll();
  }
}
