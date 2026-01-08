import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { NotificationDeliveryRepository } from './repositories/notification-delivery.repository';
import { NotificationDeliveryService } from './services/notification-delivery.service';
import { NotificationDeliveryController } from './controllers/notification-delivery.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [NotificationDeliveryController],
  providers: [NotificationDeliveryRepository, NotificationDeliveryService],
  exports: [NotificationDeliveryService, NotificationDeliveryRepository],
})
export class NotificationDeliveryModule {}
