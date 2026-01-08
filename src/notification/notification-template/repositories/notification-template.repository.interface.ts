export interface NotificationTemplateEntity {
  id: number;
  uuid: string;
  template_code: string;
  template_name: string;
  notification_type: string;
  subject_template?: string;
  body_template: string;
  language_code?: string;
  variables?: Record<string, unknown>;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface INotificationTemplateRepository {
  findAll(): Promise<NotificationTemplateEntity[]>;
  findById(id: number): Promise<NotificationTemplateEntity | null>;
  findByUuid(uuid: string): Promise<NotificationTemplateEntity | null>;
  findByCode(templateCode: string): Promise<NotificationTemplateEntity | null>;
  findByNotificationType(notificationType: string): Promise<NotificationTemplateEntity[]>;
  findByLanguageCode(languageCode: string): Promise<NotificationTemplateEntity[]>;
  findActive(): Promise<NotificationTemplateEntity[]>;
}
