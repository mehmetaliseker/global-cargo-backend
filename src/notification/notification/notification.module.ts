import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import {
  NotificationQueueRepository,
  AlertRuleRepository,
  AlertLogRepository,
} from './repositories/notification.repository';
import {
  NotificationQueueService,
  AlertRuleService,
  AlertLogService,
} from './services/notification.service';
import {
  NotificationQueueController,
  AlertRuleController,
  AlertLogController,
} from './controllers/notification.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [
    NotificationQueueController,
    AlertRuleController,
    AlertLogController,
  ],
  providers: [
    NotificationQueueRepository,
    AlertRuleRepository,
    AlertLogRepository,
    NotificationQueueService,
    AlertRuleService,
    AlertLogService,
  ],
  exports: [
    NotificationQueueService,
    AlertRuleService,
    AlertLogService,
    NotificationQueueRepository,
    AlertRuleRepository,
    AlertLogRepository,
  ],
})
export class NotificationQueueModule {}
