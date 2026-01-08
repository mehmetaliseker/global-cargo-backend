import { Module } from '@nestjs/common';
import { AuditLogModule } from './audit-log/audit-log.module';
import { ArchiveModule } from './archive/archive.module';
import { ChangeDataCaptureModule } from './change-data-capture/change-data-capture.module';

@Module({
  imports: [
    AuditLogModule,
    ArchiveModule,
    ChangeDataCaptureModule,
  ],
  exports: [
    AuditLogModule,
    ArchiveModule,
    ChangeDataCaptureModule,
  ],
})
export class AuditModule {}
