import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { BackupLogRepository } from './repositories/backup-log.repository';
import { BackupLogService } from './services/backup-log.service';
import { BackupLogController } from './controllers/backup-log.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [BackupLogController],
  providers: [BackupLogRepository, BackupLogService],
  exports: [BackupLogService, BackupLogRepository],
})
export class BackupLogModule {}
