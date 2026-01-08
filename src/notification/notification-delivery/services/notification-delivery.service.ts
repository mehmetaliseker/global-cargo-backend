import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationDeliveryRepository } from '../repositories/notification-delivery.repository';
import { NotificationDeliveryResponseDto } from '../dto/notification-delivery.dto';
import { NotificationLogEntity } from '../repositories/notification-delivery.repository.interface';

@Injectable()
export class NotificationDeliveryService {
  constructor(
    private readonly notificationDeliveryRepository: NotificationDeliveryRepository,
  ) {}

  private mapToDto(entity: NotificationLogEntity): NotificationDeliveryResponseDto {
    let providerResponse: Record<string, unknown> | undefined = undefined;
    if (entity.provider_response) {
      if (typeof entity.provider_response === 'string') {
        providerResponse = JSON.parse(entity.provider_response);
      } else {
        providerResponse = entity.provider_response as Record<string, unknown>;
      }
    }

    return {
      id: entity.id,
      notificationQueueId: entity.notification_queue_id,
      deliveryStatus: entity.delivery_status,
      errorMessage: entity.error_message ?? undefined,
      providerResponse,
      providerName: entity.provider_name ?? undefined,
      deliveryTimestamp: entity.delivery_timestamp.toISOString(),
      createdAt: entity.created_at.toISOString(),
    };
  }

  async findAll(): Promise<NotificationDeliveryResponseDto[]> {
    const entities = await this.notificationDeliveryRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<NotificationDeliveryResponseDto> {
    const entity = await this.notificationDeliveryRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(
        `Notification delivery log with id ${id} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByNotificationQueueId(
    notificationQueueId: number,
  ): Promise<NotificationDeliveryResponseDto[]> {
    const entities =
      await this.notificationDeliveryRepository.findByNotificationQueueId(
        notificationQueueId,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByDeliveryStatus(
    deliveryStatus: string,
  ): Promise<NotificationDeliveryResponseDto[]> {
    const entities =
      await this.notificationDeliveryRepository.findByDeliveryStatus(
        deliveryStatus,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByProviderName(
    providerName: string,
  ): Promise<NotificationDeliveryResponseDto[]> {
    const entities =
      await this.notificationDeliveryRepository.findByProviderName(providerName);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findFailed(): Promise<NotificationDeliveryResponseDto[]> {
    const entities = await this.notificationDeliveryRepository.findFailed();
    return entities.map((entity) => this.mapToDto(entity));
  }
}
