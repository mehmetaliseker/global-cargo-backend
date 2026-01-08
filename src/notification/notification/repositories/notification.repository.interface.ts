export interface NotificationQueueEntity {
  id: number;
  uuid: string;
  notification_template_id?: number;
  recipient_type: string;
  recipient_id: number;
  notification_data: Record<string, unknown>;
  priority: number;
  scheduled_time: Date;
  status: string;
  retry_count: number;
  max_retries: number;
  sent_at?: Date;
  delivered_at?: Date;
  error_message?: string;
  created_at: Date;
  updated_at: Date;
}

export interface AlertRuleEntity {
  id: number;
  uuid: string;
  alert_name: string;
  description?: string;
  trigger_conditions: Record<string, unknown>;
  severity_level: string;
  notification_template_id?: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface AlertLogEntity {
  id: number;
  alert_rule_id: number;
  entity_type: string;
  entity_id: number;
  alert_data?: Record<string, unknown>;
  status: string;
  resolved_at?: Date;
  resolved_by?: number;
  created_at: Date;
  updated_at: Date;
}

export interface INotificationRepository {
  // Notification Queue
  findAll(): Promise<NotificationQueueEntity[]>;
  findById(id: number): Promise<NotificationQueueEntity | null>;
  findByUuid(uuid: string): Promise<NotificationQueueEntity | null>;
  findByStatus(status: string): Promise<NotificationQueueEntity[]>;
  findByRecipient(
    recipientType: string,
    recipientId: number,
  ): Promise<NotificationQueueEntity[]>;
  findPending(): Promise<NotificationQueueEntity[]>;
  findByScheduledTimeRange(
    startDate: Date,
    endDate: Date,
  ): Promise<NotificationQueueEntity[]>;
  findFailed(): Promise<NotificationQueueEntity[]>;
}

export interface IAlertRuleRepository {
  findAll(): Promise<AlertRuleEntity[]>;
  findById(id: number): Promise<AlertRuleEntity | null>;
  findByUuid(uuid: string): Promise<AlertRuleEntity | null>;
  findActive(): Promise<AlertRuleEntity[]>;
  findBySeverityLevel(severityLevel: string): Promise<AlertRuleEntity[]>;
}

export interface IAlertLogRepository {
  findAll(): Promise<AlertLogEntity[]>;
  findById(id: number): Promise<AlertLogEntity | null>;
  findByAlertRuleId(alertRuleId: number): Promise<AlertLogEntity[]>;
  findByEntity(entityType: string, entityId: number): Promise<AlertLogEntity[]>;
  findByStatus(status: string): Promise<AlertLogEntity[]>;
  findPending(): Promise<AlertLogEntity[]>;
}
