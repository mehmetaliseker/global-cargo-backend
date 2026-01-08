import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  CustomerNotificationPreferenceEntity,
  INotificationChannelRepository,
} from './notification-channel.repository.interface';

@Injectable()
export class NotificationChannelRepository
  implements INotificationChannelRepository
{
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<CustomerNotificationPreferenceEntity[]> {
    const query = `
      SELECT id, customer_id, notification_type, preference_level, sms_enabled,
             email_enabled, push_enabled, is_active, created_at, updated_at, deleted_at
      FROM customer_notification_preference
      WHERE deleted_at IS NULL
      ORDER BY customer_id ASC, notification_type ASC
    `;
    return await this.databaseService.query<CustomerNotificationPreferenceEntity>(
      query,
    );
  }

  async findById(
    id: number,
  ): Promise<CustomerNotificationPreferenceEntity | null> {
    const query = `
      SELECT id, customer_id, notification_type, preference_level, sms_enabled,
             email_enabled, push_enabled, is_active, created_at, updated_at, deleted_at
      FROM customer_notification_preference
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<CustomerNotificationPreferenceEntity>(
      query,
      [id],
    );
  }

  async findByCustomerId(
    customerId: number,
  ): Promise<CustomerNotificationPreferenceEntity[]> {
    const query = `
      SELECT id, customer_id, notification_type, preference_level, sms_enabled,
             email_enabled, push_enabled, is_active, created_at, updated_at, deleted_at
      FROM customer_notification_preference
      WHERE customer_id = $1 AND deleted_at IS NULL
      ORDER BY notification_type ASC
    `;
    return await this.databaseService.query<CustomerNotificationPreferenceEntity>(
      query,
      [customerId],
    );
  }

  async findByCustomerIdAndType(
    customerId: number,
    notificationType: string,
  ): Promise<CustomerNotificationPreferenceEntity | null> {
    const query = `
      SELECT id, customer_id, notification_type, preference_level, sms_enabled,
             email_enabled, push_enabled, is_active, created_at, updated_at, deleted_at
      FROM customer_notification_preference
      WHERE customer_id = $1 AND notification_type = $2 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<CustomerNotificationPreferenceEntity>(
      query,
      [customerId, notificationType],
    );
  }

  async findActive(): Promise<CustomerNotificationPreferenceEntity[]> {
    const query = `
      SELECT id, customer_id, notification_type, preference_level, sms_enabled,
             email_enabled, push_enabled, is_active, created_at, updated_at, deleted_at
      FROM customer_notification_preference
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY customer_id ASC, notification_type ASC
    `;
    return await this.databaseService.query<CustomerNotificationPreferenceEntity>(
      query,
    );
  }

  async findByNotificationType(
    notificationType: string,
  ): Promise<CustomerNotificationPreferenceEntity[]> {
    const query = `
      SELECT id, customer_id, notification_type, preference_level, sms_enabled,
             email_enabled, push_enabled, is_active, created_at, updated_at, deleted_at
      FROM customer_notification_preference
      WHERE notification_type = $1 AND deleted_at IS NULL
      ORDER BY customer_id ASC
    `;
    return await this.databaseService.query<CustomerNotificationPreferenceEntity>(
      query,
      [notificationType],
    );
  }
}
