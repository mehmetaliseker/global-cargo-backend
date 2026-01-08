export interface CustomerNotificationPreferenceEntity {
  id: number;
  customer_id: number;
  notification_type: string;
  preference_level: string;
  sms_enabled: boolean;
  email_enabled: boolean;
  push_enabled: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface INotificationChannelRepository {
  findAll(): Promise<CustomerNotificationPreferenceEntity[]>;
  findById(id: number): Promise<CustomerNotificationPreferenceEntity | null>;
  findByCustomerId(customerId: number): Promise<CustomerNotificationPreferenceEntity[]>;
  findByCustomerIdAndType(
    customerId: number,
    notificationType: string,
  ): Promise<CustomerNotificationPreferenceEntity | null>;
  findActive(): Promise<CustomerNotificationPreferenceEntity[]>;
  findByNotificationType(notificationType: string): Promise<CustomerNotificationPreferenceEntity[]>;
}
