import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { NotificationTemplateRepository } from './repositories/notification-template.repository';
import { NotificationTemplateService } from './services/notification-template.service';
import { NotificationTemplateController } from './controllers/notification-template.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [NotificationTemplateController],
  providers: [NotificationTemplateRepository, NotificationTemplateService],
  exports: [NotificationTemplateService, NotificationTemplateRepository],
})
export class NotificationTemplateModule {}
