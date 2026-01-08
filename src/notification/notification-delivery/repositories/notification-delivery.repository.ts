import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  NotificationLogEntity,
  INotificationDeliveryRepository,
} from './notification-delivery.repository.interface';

@Injectable()
export class NotificationDeliveryRepository
  implements INotificationDeliveryRepository
{
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<NotificationLogEntity[]> {
    const query = `
      SELECT id, notification_queue_id, delivery_status, error_message, provider_response,
             provider_name, delivery_timestamp, created_at
      FROM notification_log
      ORDER BY delivery_timestamp DESC, created_at DESC
    `;
    return await this.databaseService.query<NotificationLogEntity>(query);
  }

  async findById(id: number): Promise<NotificationLogEntity | null> {
    const query = `
      SELECT id, notification_queue_id, delivery_status, error_message, provider_response,
             provider_name, delivery_timestamp, created_at
      FROM notification_log
      WHERE id = $1
    `;
    return await this.databaseService.queryOne<NotificationLogEntity>(
      query,
      [id],
    );
  }

  async findByNotificationQueueId(
    notificationQueueId: number,
  ): Promise<NotificationLogEntity[]> {
    const query = `
      SELECT id, notification_queue_id, delivery_status, error_message, provider_response,
             provider_name, delivery_timestamp, created_at
      FROM notification_log
      WHERE notification_queue_id = $1
      ORDER BY delivery_timestamp DESC, created_at DESC
    `;
    return await this.databaseService.query<NotificationLogEntity>(query, [
      notificationQueueId,
    ]);
  }

  async findByDeliveryStatus(
    deliveryStatus: string,
  ): Promise<NotificationLogEntity[]> {
    const query = `
      SELECT id, notification_queue_id, delivery_status, error_message, provider_response,
             provider_name, delivery_timestamp, created_at
      FROM notification_log
      WHERE delivery_status = $1
      ORDER BY delivery_timestamp DESC, created_at DESC
    `;
    return await this.databaseService.query<NotificationLogEntity>(query, [
      deliveryStatus,
    ]);
  }

  async findByProviderName(
    providerName: string,
  ): Promise<NotificationLogEntity[]> {
    const query = `
      SELECT id, notification_queue_id, delivery_status, error_message, provider_response,
             provider_name, delivery_timestamp, created_at
      FROM notification_log
      WHERE provider_name = $1
      ORDER BY delivery_timestamp DESC, created_at DESC
    `;
    return await this.databaseService.query<NotificationLogEntity>(query, [
      providerName,
    ]);
  }

  async findFailed(): Promise<NotificationLogEntity[]> {
    const query = `
      SELECT id, notification_queue_id, delivery_status, error_message, provider_response,
             provider_name, delivery_timestamp, created_at
      FROM notification_log
      WHERE delivery_status = 'failed' OR error_message IS NOT NULL
      ORDER BY delivery_timestamp DESC, created_at DESC
    `;
    return await this.databaseService.query<NotificationLogEntity>(query);
  }
}
