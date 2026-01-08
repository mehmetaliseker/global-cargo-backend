import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { NotificationDeliveryService } from '../services/notification-delivery.service';
import { NotificationDeliveryResponseDto } from '../dto/notification-delivery.dto';

@Controller('notification/deliveries')
export class NotificationDeliveryController {
  constructor(
    private readonly notificationDeliveryService: NotificationDeliveryService,
  ) {}

  @Get()
  async findAll(): Promise<NotificationDeliveryResponseDto[]> {
    return await this.notificationDeliveryService.findAll();
  }

  @Get('failed')
  async findFailed(): Promise<NotificationDeliveryResponseDto[]> {
    return await this.notificationDeliveryService.findFailed();
  }

  @Get('status/:deliveryStatus')
  async findByDeliveryStatus(
    @Param('deliveryStatus') deliveryStatus: string,
  ): Promise<NotificationDeliveryResponseDto[]> {
    return await this.notificationDeliveryService.findByDeliveryStatus(
      deliveryStatus,
    );
  }

  @Get('provider/:providerName')
  async findByProviderName(
    @Param('providerName') providerName: string,
  ): Promise<NotificationDeliveryResponseDto[]> {
    return await this.notificationDeliveryService.findByProviderName(
      providerName,
    );
  }

  @Get('queue/:notificationQueueId')
  async findByNotificationQueueId(
    @Param('notificationQueueId', ParseIntPipe) notificationQueueId: number,
  ): Promise<NotificationDeliveryResponseDto[]> {
    return await this.notificationDeliveryService.findByNotificationQueueId(
      notificationQueueId,
    );
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<NotificationDeliveryResponseDto> {
    return await this.notificationDeliveryService.findById(id);
  }
}
