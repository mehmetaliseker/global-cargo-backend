import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { CargoDamageReportRepository } from './repositories/cargo-damage-report.repository';
import { CargoDamageReportService } from './services/cargo-damage-report.service';
import { CargoDamageReportController } from './controllers/cargo-damage-report.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [CargoDamageReportController],
  providers: [CargoDamageReportRepository, CargoDamageReportService],
  exports: [CargoDamageReportService, CargoDamageReportRepository],
})
export class CargoDamageReportModule {}

