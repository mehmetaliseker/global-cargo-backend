import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  NotificationQueueEntity,
  INotificationRepository,
  AlertRuleEntity,
  IAlertRuleRepository,
  AlertLogEntity,
  IAlertLogRepository,
} from './notification.repository.interface';

@Injectable()
export class NotificationQueueRepository implements INotificationRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<NotificationQueueEntity[]> {
    const query = `
      SELECT id, uuid, notification_template_id, recipient_type, recipient_id,
             notification_data, priority, scheduled_time, status, retry_count,
             max_retries, sent_at, delivered_at, error_message, created_at, updated_at
      FROM notification_queue
      ORDER BY priority DESC, scheduled_time ASC, created_at DESC
    `;
    return await this.databaseService.query<NotificationQueueEntity>(query);
  }

  async findById(id: number): Promise<NotificationQueueEntity | null> {
    const query = `
      SELECT id, uuid, notification_template_id, recipient_type, recipient_id,
             notification_data, priority, scheduled_time, status, retry_count,
             max_retries, sent_at, delivered_at, error_message, created_at, updated_at
      FROM notification_queue
      WHERE id = $1
    `;
    return await this.databaseService.queryOne<NotificationQueueEntity>(
      query,
      [id],
    );
  }

  async findByUuid(uuid: string): Promise<NotificationQueueEntity | null> {
    const query = `
      SELECT id, uuid, notification_template_id, recipient_type, recipient_id,
             notification_data, priority, scheduled_time, status, retry_count,
             max_retries, sent_at, delivered_at, error_message, created_at, updated_at
      FROM notification_queue
      WHERE uuid = $1
    `;
    return await this.databaseService.queryOne<NotificationQueueEntity>(
      query,
      [uuid],
    );
  }

  async findByStatus(status: string): Promise<NotificationQueueEntity[]> {
    const query = `
      SELECT id, uuid, notification_template_id, recipient_type, recipient_id,
             notification_data, priority, scheduled_time, status, retry_count,
             max_retries, sent_at, delivered_at, error_message, created_at, updated_at
      FROM notification_queue
      WHERE status = $1
      ORDER BY priority DESC, scheduled_time ASC, created_at DESC
    `;
    return await this.databaseService.query<NotificationQueueEntity>(query, [
      status,
    ]);
  }

  async findByRecipient(
    recipientType: string,
    recipientId: number,
  ): Promise<NotificationQueueEntity[]> {
    const query = `
      SELECT id, uuid, notification_template_id, recipient_type, recipient_id,
             notification_data, priority, scheduled_time, status, retry_count,
             max_retries, sent_at, delivered_at, error_message, created_at, updated_at
      FROM notification_queue
      WHERE recipient_type = $1 AND recipient_id = $2
      ORDER BY priority DESC, scheduled_time ASC, created_at DESC
    `;
    return await this.databaseService.query<NotificationQueueEntity>(query, [
      recipientType,
      recipientId,
    ]);
  }

  async findPending(): Promise<NotificationQueueEntity[]> {
    const query = `
      SELECT id, uuid, notification_template_id, recipient_type, recipient_id,
             notification_data, priority, scheduled_time, status, retry_count,
             max_retries, sent_at, delivered_at, error_message, created_at, updated_at
      FROM notification_queue
      WHERE status = 'pending' AND scheduled_time <= CURRENT_TIMESTAMP
      ORDER BY priority DESC, scheduled_time ASC, created_at ASC
    `;
    return await this.databaseService.query<NotificationQueueEntity>(query);
  }

  async findByScheduledTimeRange(
    startDate: Date,
    endDate: Date,
  ): Promise<NotificationQueueEntity[]> {
    const query = `
      SELECT id, uuid, notification_template_id, recipient_type, recipient_id,
             notification_data, priority, scheduled_time, status, retry_count,
             max_retries, sent_at, delivered_at, error_message, created_at, updated_at
      FROM notification_queue
      WHERE scheduled_time >= $1 AND scheduled_time <= $2
      ORDER BY priority DESC, scheduled_time ASC, created_at DESC
    `;
    return await this.databaseService.query<NotificationQueueEntity>(query, [
      startDate,
      endDate,
    ]);
  }

  async findFailed(): Promise<NotificationQueueEntity[]> {
    const query = `
      SELECT id, uuid, notification_template_id, recipient_type, recipient_id,
             notification_data, priority, scheduled_time, status, retry_count,
             max_retries, sent_at, delivered_at, error_message, created_at, updated_at
      FROM notification_queue
      WHERE status = 'failed' OR (status = 'pending' AND retry_count >= max_retries)
      ORDER BY priority DESC, created_at DESC
    `;
    return await this.databaseService.query<NotificationQueueEntity>(query);
  }
}

@Injectable()
export class AlertRuleRepository implements IAlertRuleRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<AlertRuleEntity[]> {
    const query = `
      SELECT id, uuid, alert_name, description, trigger_conditions, severity_level,
             notification_template_id, is_active, created_at, updated_at, deleted_at
      FROM alert_rule
      WHERE deleted_at IS NULL
      ORDER BY severity_level DESC, alert_name ASC
    `;
    return await this.databaseService.query<AlertRuleEntity>(query);
  }

  async findById(id: number): Promise<AlertRuleEntity | null> {
    const query = `
      SELECT id, uuid, alert_name, description, trigger_conditions, severity_level,
             notification_template_id, is_active, created_at, updated_at, deleted_at
      FROM alert_rule
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<AlertRuleEntity>(query, [id]);
  }

  async findByUuid(uuid: string): Promise<AlertRuleEntity | null> {
    const query = `
      SELECT id, uuid, alert_name, description, trigger_conditions, severity_level,
             notification_template_id, is_active, created_at, updated_at, deleted_at
      FROM alert_rule
      WHERE uuid = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<AlertRuleEntity>(query, [uuid]);
  }

  async findActive(): Promise<AlertRuleEntity[]> {
    const query = `
      SELECT id, uuid, alert_name, description, trigger_conditions, severity_level,
             notification_template_id, is_active, created_at, updated_at, deleted_at
      FROM alert_rule
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY severity_level DESC, alert_name ASC
    `;
    return await this.databaseService.query<AlertRuleEntity>(query);
  }

  async findBySeverityLevel(
    severityLevel: string,
  ): Promise<AlertRuleEntity[]> {
    const query = `
      SELECT id, uuid, alert_name, description, trigger_conditions, severity_level,
             notification_template_id, is_active, created_at, updated_at, deleted_at
      FROM alert_rule
      WHERE severity_level = $1 AND deleted_at IS NULL
      ORDER BY alert_name ASC
    `;
    return await this.databaseService.query<AlertRuleEntity>(query, [
      severityLevel,
    ]);
  }
}

@Injectable()
export class AlertLogRepository implements IAlertLogRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<AlertLogEntity[]> {
    const query = `
      SELECT id, alert_rule_id, entity_type, entity_id, alert_data, status,
             resolved_at, resolved_by, created_at, updated_at
      FROM alert_log
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<AlertLogEntity>(query);
  }

  async findById(id: number): Promise<AlertLogEntity | null> {
    const query = `
      SELECT id, alert_rule_id, entity_type, entity_id, alert_data, status,
             resolved_at, resolved_by, created_at, updated_at
      FROM alert_log
      WHERE id = $1
    `;
    return await this.databaseService.queryOne<AlertLogEntity>(query, [id]);
  }

  async findByAlertRuleId(alertRuleId: number): Promise<AlertLogEntity[]> {
    const query = `
      SELECT id, alert_rule_id, entity_type, entity_id, alert_data, status,
             resolved_at, resolved_by, created_at, updated_at
      FROM alert_log
      WHERE alert_rule_id = $1
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<AlertLogEntity>(query, [
      alertRuleId,
    ]);
  }

  async findByEntity(
    entityType: string,
    entityId: number,
  ): Promise<AlertLogEntity[]> {
    const query = `
      SELECT id, alert_rule_id, entity_type, entity_id, alert_data, status,
             resolved_at, resolved_by, created_at, updated_at
      FROM alert_log
      WHERE entity_type = $1 AND entity_id = $2
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<AlertLogEntity>(query, [
      entityType,
      entityId,
    ]);
  }

  async findByStatus(status: string): Promise<AlertLogEntity[]> {
    const query = `
      SELECT id, alert_rule_id, entity_type, entity_id, alert_data, status,
             resolved_at, resolved_by, created_at, updated_at
      FROM alert_log
      WHERE status = $1
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<AlertLogEntity>(query, [status]);
  }

  async findPending(): Promise<AlertLogEntity[]> {
    const query = `
      SELECT id, alert_rule_id, entity_type, entity_id, alert_data, status,
             resolved_at, resolved_by, created_at, updated_at
      FROM alert_log
      WHERE status = 'pending'
      ORDER BY created_at ASC
    `;
    return await this.databaseService.query<AlertLogEntity>(query);
  }
}
