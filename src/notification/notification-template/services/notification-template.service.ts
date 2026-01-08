import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationTemplateRepository } from '../repositories/notification-template.repository';
import { NotificationTemplateResponseDto } from '../dto/notification-template.dto';
import { NotificationTemplateEntity } from '../repositories/notification-template.repository.interface';

@Injectable()
export class NotificationTemplateService {
  constructor(
    private readonly notificationTemplateRepository: NotificationTemplateRepository,
  ) {}

  private mapToDto(
    entity: NotificationTemplateEntity,
  ): NotificationTemplateResponseDto {
    let variables: Record<string, unknown> | undefined = undefined;
    if (entity.variables) {
      if (typeof entity.variables === 'string') {
        variables = JSON.parse(entity.variables);
      } else {
        variables = entity.variables as Record<string, unknown>;
      }
    }

    return {
      id: entity.id,
      uuid: entity.uuid,
      templateCode: entity.template_code,
      templateName: entity.template_name,
      notificationType: entity.notification_type,
      subjectTemplate: entity.subject_template ?? undefined,
      bodyTemplate: entity.body_template,
      languageCode: entity.language_code ?? undefined,
      variables,
      isActive: entity.is_active,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<NotificationTemplateResponseDto[]> {
    const entities = await this.notificationTemplateRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<NotificationTemplateResponseDto> {
    const entity = await this.notificationTemplateRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(
        `Notification template with id ${id} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByUuid(uuid: string): Promise<NotificationTemplateResponseDto> {
    const entity = await this.notificationTemplateRepository.findByUuid(uuid);
    if (!entity) {
      throw new NotFoundException(
        `Notification template with uuid ${uuid} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByCode(
    templateCode: string,
  ): Promise<NotificationTemplateResponseDto> {
    const entity =
      await this.notificationTemplateRepository.findByCode(templateCode);
    if (!entity) {
      throw new NotFoundException(
        `Notification template with code ${templateCode} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByNotificationType(
    notificationType: string,
  ): Promise<NotificationTemplateResponseDto[]> {
    const entities =
      await this.notificationTemplateRepository.findByNotificationType(
        notificationType,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByLanguageCode(
    languageCode: string,
  ): Promise<NotificationTemplateResponseDto[]> {
    const entities =
      await this.notificationTemplateRepository.findByLanguageCode(languageCode);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findActive(): Promise<NotificationTemplateResponseDto[]> {
    const entities = await this.notificationTemplateRepository.findActive();
    return entities.map((entity) => this.mapToDto(entity));
  }
}
