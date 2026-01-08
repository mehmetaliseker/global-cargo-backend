import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  NotificationTemplateEntity,
  INotificationTemplateRepository,
} from './notification-template.repository.interface';

@Injectable()
export class NotificationTemplateRepository
  implements INotificationTemplateRepository
{
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<NotificationTemplateEntity[]> {
    const query = `
      SELECT id, uuid, template_code, template_name, notification_type, subject_template,
             body_template, language_code, variables, is_active, created_at, updated_at, deleted_at
      FROM notification_template
      WHERE deleted_at IS NULL
      ORDER BY template_code ASC
    `;
    return await this.databaseService.query<NotificationTemplateEntity>(query);
  }

  async findById(id: number): Promise<NotificationTemplateEntity | null> {
    const query = `
      SELECT id, uuid, template_code, template_name, notification_type, subject_template,
             body_template, language_code, variables, is_active, created_at, updated_at, deleted_at
      FROM notification_template
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<NotificationTemplateEntity>(
      query,
      [id],
    );
  }

  async findByUuid(uuid: string): Promise<NotificationTemplateEntity | null> {
    const query = `
      SELECT id, uuid, template_code, template_name, notification_type, subject_template,
             body_template, language_code, variables, is_active, created_at, updated_at, deleted_at
      FROM notification_template
      WHERE uuid = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<NotificationTemplateEntity>(
      query,
      [uuid],
    );
  }

  async findByCode(
    templateCode: string,
  ): Promise<NotificationTemplateEntity | null> {
    const query = `
      SELECT id, uuid, template_code, template_name, notification_type, subject_template,
             body_template, language_code, variables, is_active, created_at, updated_at, deleted_at
      FROM notification_template
      WHERE template_code = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<NotificationTemplateEntity>(
      query,
      [templateCode],
    );
  }

  async findByNotificationType(
    notificationType: string,
  ): Promise<NotificationTemplateEntity[]> {
    const query = `
      SELECT id, uuid, template_code, template_name, notification_type, subject_template,
             body_template, language_code, variables, is_active, created_at, updated_at, deleted_at
      FROM notification_template
      WHERE notification_type = $1 AND deleted_at IS NULL
      ORDER BY template_code ASC
    `;
    return await this.databaseService.query<NotificationTemplateEntity>(
      query,
      [notificationType],
    );
  }

  async findByLanguageCode(
    languageCode: string,
  ): Promise<NotificationTemplateEntity[]> {
    const query = `
      SELECT id, uuid, template_code, template_name, notification_type, subject_template,
             body_template, language_code, variables, is_active, created_at, updated_at, deleted_at
      FROM notification_template
      WHERE language_code = $1 AND deleted_at IS NULL
      ORDER BY template_code ASC
    `;
    return await this.databaseService.query<NotificationTemplateEntity>(
      query,
      [languageCode],
    );
  }

  async findActive(): Promise<NotificationTemplateEntity[]> {
    const query = `
      SELECT id, uuid, template_code, template_name, notification_type, subject_template,
             body_template, language_code, variables, is_active, created_at, updated_at, deleted_at
      FROM notification_template
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY template_code ASC
    `;
    return await this.databaseService.query<NotificationTemplateEntity>(query);
  }
}
