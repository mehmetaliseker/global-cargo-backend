export interface AuditLogEntity {
  id: number;
  table_name: string;
  record_id: number;
  record_uuid?: string;
  action: string;
  old_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
  user_id?: number;
  user_type?: string;
  service_name?: string;
  request_id?: string;
  correlation_id?: string;
  ip_address?: string;
  user_agent?: string;
  timestamp: Date;
  created_at: Date;
}

export interface IAuditLogRepository {
  findAll(): Promise<AuditLogEntity[]>;
  findById(id: number): Promise<AuditLogEntity | null>;
  findByTableName(tableName: string): Promise<AuditLogEntity[]>;
  findByRecordId(tableName: string, recordId: number): Promise<AuditLogEntity[]>;
  findByRecordUuid(tableName: string, recordUuid: string): Promise<AuditLogEntity[]>;
  findByAction(action: string): Promise<AuditLogEntity[]>;
  findByUserId(userId: number): Promise<AuditLogEntity[]>;
  findByRequestId(requestId: string): Promise<AuditLogEntity[]>;
  findByCorrelationId(correlationId: string): Promise<AuditLogEntity[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<AuditLogEntity[]>;
  findByTableAndDateRange(
    tableName: string,
    startDate: Date,
    endDate: Date,
  ): Promise<AuditLogEntity[]>;
}
