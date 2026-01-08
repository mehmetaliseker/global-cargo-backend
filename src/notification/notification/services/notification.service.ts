import { Injectable, NotFoundException } from '@nestjs/common';
import {
  NotificationQueueRepository,
  AlertRuleRepository,
  AlertLogRepository,
} from '../repositories/notification.repository';
import {
  NotificationQueueResponseDto,
  AlertRuleResponseDto,
  AlertLogResponseDto,
} from '../dto/notification.dto';
import {
  NotificationQueueEntity,
  AlertRuleEntity,
  AlertLogEntity,
} from '../repositories/notification.repository.interface';

@Injectable()
export class NotificationQueueService {
  constructor(
    private readonly notificationRepository: NotificationQueueRepository,
  ) {}

  private mapNotificationToDto(
    entity: NotificationQueueEntity,
  ): NotificationQueueResponseDto {
    let notificationData: Record<string, unknown> = {};
    if (entity.notification_data) {
      if (typeof entity.notification_data === 'string') {
        notificationData = JSON.parse(entity.notification_data);
      } else {
        notificationData = entity.notification_data as Record<string, unknown>;
      }
    }

    return {
      id: entity.id,
      uuid: entity.uuid,
      notificationTemplateId: entity.notification_template_id ?? undefined,
      recipientType: entity.recipient_type,
      recipientId: entity.recipient_id,
      notificationData,
      priority: entity.priority,
      scheduledTime: entity.scheduled_time.toISOString(),
      status: entity.status,
      retryCount: entity.retry_count,
      maxRetries: entity.max_retries,
      sentAt: entity.sent_at?.toISOString(),
      deliveredAt: entity.delivered_at?.toISOString(),
      errorMessage: entity.error_message ?? undefined,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
    };
  }

  async findAll(): Promise<NotificationQueueResponseDto[]> {
    const entities = await this.notificationRepository.findAll();
    return entities.map((entity) => this.mapNotificationToDto(entity));
  }

  async findById(id: number): Promise<NotificationQueueResponseDto> {
    const entity = await this.notificationRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(
        `Notification queue item with id ${id} not found`,
      );
    }
    return this.mapNotificationToDto(entity);
  }

  async findByUuid(uuid: string): Promise<NotificationQueueResponseDto> {
    const entity = await this.notificationRepository.findByUuid(uuid);
    if (!entity) {
      throw new NotFoundException(
        `Notification queue item with uuid ${uuid} not found`,
      );
    }
    return this.mapNotificationToDto(entity);
  }

  async findByStatus(status: string): Promise<NotificationQueueResponseDto[]> {
    const entities = await this.notificationRepository.findByStatus(status);
    return entities.map((entity) => this.mapNotificationToDto(entity));
  }

  async findByRecipient(
    recipientType: string,
    recipientId: number,
  ): Promise<NotificationQueueResponseDto[]> {
    const entities = await this.notificationRepository.findByRecipient(
      recipientType,
      recipientId,
    );
    return entities.map((entity) => this.mapNotificationToDto(entity));
  }

  async findPending(): Promise<NotificationQueueResponseDto[]> {
    const entities = await this.notificationRepository.findPending();
    return entities.map((entity) => this.mapNotificationToDto(entity));
  }

  async findByScheduledTimeRange(
    startDate: Date,
    endDate: Date,
  ): Promise<NotificationQueueResponseDto[]> {
    const entities =
      await this.notificationRepository.findByScheduledTimeRange(
        startDate,
        endDate,
      );
    return entities.map((entity) => this.mapNotificationToDto(entity));
  }

  async findFailed(): Promise<NotificationQueueResponseDto[]> {
    const entities = await this.notificationRepository.findFailed();
    return entities.map((entity) => this.mapNotificationToDto(entity));
  }
}

@Injectable()
export class AlertRuleService {
  constructor(
    private readonly alertRuleRepository: AlertRuleRepository,
  ) {}

  private mapAlertRuleToDto(entity: AlertRuleEntity): AlertRuleResponseDto {
    let triggerConditions: Record<string, unknown> = {};
    if (entity.trigger_conditions) {
      if (typeof entity.trigger_conditions === 'string') {
        triggerConditions = JSON.parse(entity.trigger_conditions);
      } else {
        triggerConditions = entity.trigger_conditions as Record<
          string,
          unknown
        >;
      }
    }

    return {
      id: entity.id,
      uuid: entity.uuid,
      alertName: entity.alert_name,
      description: entity.description ?? undefined,
      triggerConditions,
      severityLevel: entity.severity_level,
      notificationTemplateId: entity.notification_template_id ?? undefined,
      isActive: entity.is_active,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<AlertRuleResponseDto[]> {
    const entities = await this.alertRuleRepository.findAll();
    return entities.map((entity) => this.mapAlertRuleToDto(entity));
  }

  async findById(id: number): Promise<AlertRuleResponseDto> {
    const entity = await this.alertRuleRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Alert rule with id ${id} not found`);
    }
    return this.mapAlertRuleToDto(entity);
  }

  async findByUuid(uuid: string): Promise<AlertRuleResponseDto> {
    const entity = await this.alertRuleRepository.findByUuid(uuid);
    if (!entity) {
      throw new NotFoundException(`Alert rule with uuid ${uuid} not found`);
    }
    return this.mapAlertRuleToDto(entity);
  }

  async findActive(): Promise<AlertRuleResponseDto[]> {
    const entities = await this.alertRuleRepository.findActive();
    return entities.map((entity) => this.mapAlertRuleToDto(entity));
  }

  async findBySeverityLevel(
    severityLevel: string,
  ): Promise<AlertRuleResponseDto[]> {
    const entities =
      await this.alertRuleRepository.findBySeverityLevel(severityLevel);
    return entities.map((entity) => this.mapAlertRuleToDto(entity));
  }
}

@Injectable()
export class AlertLogService {
  constructor(
    private readonly alertLogRepository: AlertLogRepository,
  ) {}

  private mapAlertLogToDto(entity: AlertLogEntity): AlertLogResponseDto {
    let alertData: Record<string, unknown> | undefined = undefined;
    if (entity.alert_data) {
      if (typeof entity.alert_data === 'string') {
        alertData = JSON.parse(entity.alert_data);
      } else {
        alertData = entity.alert_data as Record<string, unknown>;
      }
    }

    return {
      id: entity.id,
      alertRuleId: entity.alert_rule_id,
      entityType: entity.entity_type,
      entityId: entity.entity_id,
      alertData,
      status: entity.status,
      resolvedAt: entity.resolved_at?.toISOString(),
      resolvedBy: entity.resolved_by ?? undefined,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
    };
  }

  async findAll(): Promise<AlertLogResponseDto[]> {
    const entities = await this.alertLogRepository.findAll();
    return entities.map((entity) => this.mapAlertLogToDto(entity));
  }

  async findById(id: number): Promise<AlertLogResponseDto> {
    const entity = await this.alertLogRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Alert log with id ${id} not found`);
    }
    return this.mapAlertLogToDto(entity);
  }

  async findByAlertRuleId(alertRuleId: number): Promise<AlertLogResponseDto[]> {
    const entities =
      await this.alertLogRepository.findByAlertRuleId(alertRuleId);
    return entities.map((entity) => this.mapAlertLogToDto(entity));
  }

  async findByEntity(
    entityType: string,
    entityId: number,
  ): Promise<AlertLogResponseDto[]> {
    const entities = await this.alertLogRepository.findByEntity(
      entityType,
      entityId,
    );
    return entities.map((entity) => this.mapAlertLogToDto(entity));
  }

  async findByStatus(status: string): Promise<AlertLogResponseDto[]> {
    const entities = await this.alertLogRepository.findByStatus(status);
    return entities.map((entity) => this.mapAlertLogToDto(entity));
  }

  async findPending(): Promise<AlertLogResponseDto[]> {
    const entities = await this.alertLogRepository.findPending();
    return entities.map((entity) => this.mapAlertLogToDto(entity));
  }
}
