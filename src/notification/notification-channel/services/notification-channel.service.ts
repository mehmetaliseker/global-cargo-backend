import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationChannelRepository } from '../repositories/notification-channel.repository';
import { CustomerNotificationPreferenceResponseDto } from '../dto/notification-channel.dto';
import { CustomerNotificationPreferenceEntity } from '../repositories/notification-channel.repository.interface';

@Injectable()
export class NotificationChannelService {
  constructor(
    private readonly notificationChannelRepository: NotificationChannelRepository,
  ) {}

  private mapToDto(
    entity: CustomerNotificationPreferenceEntity,
  ): CustomerNotificationPreferenceResponseDto {
    return {
      id: entity.id,
      customerId: entity.customer_id,
      notificationType: entity.notification_type,
      preferenceLevel: entity.preference_level,
      smsEnabled: entity.sms_enabled,
      emailEnabled: entity.email_enabled,
      pushEnabled: entity.push_enabled,
      isActive: entity.is_active,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<CustomerNotificationPreferenceResponseDto[]> {
    const entities = await this.notificationChannelRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(
    id: number,
  ): Promise<CustomerNotificationPreferenceResponseDto> {
    const entity = await this.notificationChannelRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(
        `Customer notification preference with id ${id} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByCustomerId(
    customerId: number,
  ): Promise<CustomerNotificationPreferenceResponseDto[]> {
    const entities =
      await this.notificationChannelRepository.findByCustomerId(customerId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByCustomerIdAndType(
    customerId: number,
    notificationType: string,
  ): Promise<CustomerNotificationPreferenceResponseDto> {
    const entity =
      await this.notificationChannelRepository.findByCustomerIdAndType(
        customerId,
        notificationType,
      );
    if (!entity) {
      throw new NotFoundException(
        `Customer notification preference for customer ${customerId} and type ${notificationType} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findActive(): Promise<CustomerNotificationPreferenceResponseDto[]> {
    const entities = await this.notificationChannelRepository.findActive();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByNotificationType(
    notificationType: string,
  ): Promise<CustomerNotificationPreferenceResponseDto[]> {
    const entities =
      await this.notificationChannelRepository.findByNotificationType(
        notificationType,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }
}
