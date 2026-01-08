import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  AuditLogEntity,
  IAuditLogRepository,
} from './audit-log.repository.interface';

@Injectable()
export class AuditLogRepository implements IAuditLogRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<AuditLogEntity[]> {
    const query = `
      SELECT id, table_name, record_id, record_uuid, action, old_values, new_values,
             user_id, user_type, service_name, request_id, correlation_id, ip_address,
             user_agent, timestamp, created_at
      FROM audit_log
      ORDER BY timestamp DESC
      LIMIT 1000
    `;
    return await this.databaseService.query<AuditLogEntity>(query);
  }

  async findById(id: number): Promise<AuditLogEntity | null> {
    const query = `
      SELECT id, table_name, record_id, record_uuid, action, old_values, new_values,
             user_id, user_type, service_name, request_id, correlation_id, ip_address,
             user_agent, timestamp, created_at
      FROM audit_log
      WHERE id = $1
    `;
    return await this.databaseService.queryOne<AuditLogEntity>(query, [id]);
  }

  async findByTableName(tableName: string): Promise<AuditLogEntity[]> {
    const query = `
      SELECT id, table_name, record_id, record_uuid, action, old_values, new_values,
             user_id, user_type, service_name, request_id, correlation_id, ip_address,
             user_agent, timestamp, created_at
      FROM audit_log
      WHERE table_name = $1
      ORDER BY timestamp DESC
      LIMIT 1000
    `;
    return await this.databaseService.query<AuditLogEntity>(query, [tableName]);
  }

  async findByRecordId(
    tableName: string,
    recordId: number,
  ): Promise<AuditLogEntity[]> {
    const query = `
      SELECT id, table_name, record_id, record_uuid, action, old_values, new_values,
             user_id, user_type, service_name, request_id, correlation_id, ip_address,
             user_agent, timestamp, created_at
      FROM audit_log
      WHERE table_name = $1 AND record_id = $2
      ORDER BY timestamp ASC
    `;
    return await this.databaseService.query<AuditLogEntity>(query, [
      tableName,
      recordId,
    ]);
  }

  async findByRecordUuid(
    tableName: string,
    recordUuid: string,
  ): Promise<AuditLogEntity[]> {
    const query = `
      SELECT id, table_name, record_id, record_uuid, action, old_values, new_values,
             user_id, user_type, service_name, request_id, correlation_id, ip_address,
             user_agent, timestamp, created_at
      FROM audit_log
      WHERE table_name = $1 AND record_uuid = $2
      ORDER BY timestamp ASC
    `;
    return await this.databaseService.query<AuditLogEntity>(query, [
      tableName,
      recordUuid,
    ]);
  }

  async findByAction(action: string): Promise<AuditLogEntity[]> {
    const query = `
      SELECT id, table_name, record_id, record_uuid, action, old_values, new_values,
             user_id, user_type, service_name, request_id, correlation_id, ip_address,
             user_agent, timestamp, created_at
      FROM audit_log
      WHERE action = $1
      ORDER BY timestamp DESC
      LIMIT 1000
    `;
    return await this.databaseService.query<AuditLogEntity>(query, [action]);
  }

  async findByUserId(userId: number): Promise<AuditLogEntity[]> {
    const query = `
      SELECT id, table_name, record_id, record_uuid, action, old_values, new_values,
             user_id, user_type, service_name, request_id, correlation_id, ip_address,
             user_agent, timestamp, created_at
      FROM audit_log
      WHERE user_id = $1
      ORDER BY timestamp DESC
      LIMIT 1000
    `;
    return await this.databaseService.query<AuditLogEntity>(query, [userId]);
  }

  async findByRequestId(requestId: string): Promise<AuditLogEntity[]> {
    const query = `
      SELECT id, table_name, record_id, record_uuid, action, old_values, new_values,
             user_id, user_type, service_name, request_id, correlation_id, ip_address,
             user_agent, timestamp, created_at
      FROM audit_log
      WHERE request_id = $1
      ORDER BY timestamp ASC
    `;
    return await this.databaseService.query<AuditLogEntity>(query, [requestId]);
  }

  async findByCorrelationId(
    correlationId: string,
  ): Promise<AuditLogEntity[]> {
    const query = `
      SELECT id, table_name, record_id, record_uuid, action, old_values, new_values,
             user_id, user_type, service_name, request_id, correlation_id, ip_address,
             user_agent, timestamp, created_at
      FROM audit_log
      WHERE correlation_id = $1
      ORDER BY timestamp ASC
    `;
    return await this.databaseService.query<AuditLogEntity>(query, [
      correlationId,
    ]);
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<AuditLogEntity[]> {
    const query = `
      SELECT id, table_name, record_id, record_uuid, action, old_values, new_values,
             user_id, user_type, service_name, request_id, correlation_id, ip_address,
             user_agent, timestamp, created_at
      FROM audit_log
      WHERE timestamp >= $1 AND timestamp <= $2
      ORDER BY timestamp DESC
      LIMIT 5000
    `;
    return await this.databaseService.query<AuditLogEntity>(query, [
      startDate,
      endDate,
    ]);
  }

  async findByTableAndDateRange(
    tableName: string,
    startDate: Date,
    endDate: Date,
  ): Promise<AuditLogEntity[]> {
    const query = `
      SELECT id, table_name, record_id, record_uuid, action, old_values, new_values,
             user_id, user_type, service_name, request_id, correlation_id, ip_address,
             user_agent, timestamp, created_at
      FROM audit_log
      WHERE table_name = $1 AND timestamp >= $2 AND timestamp <= $3
      ORDER BY timestamp DESC
      LIMIT 5000
    `;
    return await this.databaseService.query<AuditLogEntity>(query, [
      tableName,
      startDate,
      endDate,
    ]);
  }
}
