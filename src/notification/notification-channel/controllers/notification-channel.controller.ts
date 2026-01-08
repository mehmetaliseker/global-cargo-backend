import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { NotificationChannelService } from '../services/notification-channel.service';
import { CustomerNotificationPreferenceResponseDto } from '../dto/notification-channel.dto';

@Controller('notification/channels')
export class NotificationChannelController {
  constructor(
    private readonly notificationChannelService: NotificationChannelService,
  ) {}

  @Get()
  async findAll(): Promise<CustomerNotificationPreferenceResponseDto[]> {
    return await this.notificationChannelService.findAll();
  }

  @Get('active')
  async findActive(): Promise<CustomerNotificationPreferenceResponseDto[]> {
    return await this.notificationChannelService.findActive();
  }

  @Get('type/:notificationType')
  async findByNotificationType(
    @Param('notificationType') notificationType: string,
  ): Promise<CustomerNotificationPreferenceResponseDto[]> {
    return await this.notificationChannelService.findByNotificationType(
      notificationType,
    );
  }

  @Get('customer/:customerId')
  async findByCustomerId(
    @Param('customerId', ParseIntPipe) customerId: number,
  ): Promise<CustomerNotificationPreferenceResponseDto[]> {
    return await this.notificationChannelService.findByCustomerId(customerId);
  }

  @Get('customer/:customerId/type/:notificationType')
  async findByCustomerIdAndType(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Param('notificationType') notificationType: string,
  ): Promise<CustomerNotificationPreferenceResponseDto> {
    return await this.notificationChannelService.findByCustomerIdAndType(
      customerId,
      notificationType,
    );
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CustomerNotificationPreferenceResponseDto> {
    return await this.notificationChannelService.findById(id);
  }
}
