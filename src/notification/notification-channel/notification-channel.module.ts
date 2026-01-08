import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { NotificationChannelRepository } from './repositories/notification-channel.repository';
import { NotificationChannelService } from './services/notification-channel.service';
import { NotificationChannelController } from './controllers/notification-channel.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [NotificationChannelController],
  providers: [NotificationChannelRepository, NotificationChannelService],
  exports: [NotificationChannelService, NotificationChannelRepository],
})
export class NotificationChannelModule {}
