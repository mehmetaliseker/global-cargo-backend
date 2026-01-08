import { Module } from '@nestjs/common';
import { ExchangeRateModule } from './exchange-rate/exchange-rate.module';
import { SystemConfigModule } from './system-config/system-config.module';
import { MaintenanceLogModule } from './maintenance-log/maintenance-log.module';
import { BackupLogModule } from './backup-log/backup-log.module';

@Module({
  imports: [
    ExchangeRateModule,
    SystemConfigModule,
    MaintenanceLogModule,
    BackupLogModule,
  ],
  exports: [
    ExchangeRateModule,
    SystemConfigModule,
    MaintenanceLogModule,
    BackupLogModule,
  ],
})
export class SystemModule {}
