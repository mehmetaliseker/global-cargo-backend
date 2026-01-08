import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { HrKpiRepository } from './repositories/hr-kpi.repository';
import { HrKpiService } from './services/hr-kpi.service';
import { HrKpiController } from './controllers/hr-kpi.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [HrKpiController],
  providers: [HrKpiRepository, HrKpiService],
  exports: [HrKpiService, HrKpiRepository],
})
export class HrKpiModule {}

