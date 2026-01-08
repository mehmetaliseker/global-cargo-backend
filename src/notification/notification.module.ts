import { Module } from '@nestjs/common';
import { NotificationTemplateModule } from './notification-template/notification-template.module';
import { NotificationQueueModule } from './notification/notification.module';
import { NotificationDeliveryModule } from './notification-delivery/notification-delivery.module';
import { NotificationChannelModule } from './notification-channel/notification-channel.module';

@Module({
  imports: [
    NotificationTemplateModule,
    NotificationQueueModule,
    NotificationDeliveryModule,
    NotificationChannelModule,
  ],
  exports: [
    NotificationTemplateModule,
    NotificationQueueModule,
    NotificationDeliveryModule,
    NotificationChannelModule,
  ],
})
export class NotificationModule {}
