export interface NotificationLogEntity {
  id: number;
  notification_queue_id: number;
  delivery_status: string;
  error_message?: string;
  provider_response?: Record<string, unknown>;
  provider_name?: string;
  delivery_timestamp: Date;
  created_at: Date;
}

export interface INotificationDeliveryRepository {
  findAll(): Promise<NotificationLogEntity[]>;
  findById(id: number): Promise<NotificationLogEntity | null>;
  findByNotificationQueueId(
    notificationQueueId: number,
  ): Promise<NotificationLogEntity[]>;
  findByDeliveryStatus(deliveryStatus: string): Promise<NotificationLogEntity[]>;
  findByProviderName(providerName: string): Promise<NotificationLogEntity[]>;
  findFailed(): Promise<NotificationLogEntity[]>;
}
