import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { DashboardMetricRepository } from './repositories/dashboard-metric.repository';
import { DashboardMetricService } from './services/dashboard-metric.service';
import { DashboardMetricController } from './controllers/dashboard-metric.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [DashboardMetricController],
    providers: [DashboardMetricRepository, DashboardMetricService],
    exports: [DashboardMetricService, DashboardMetricRepository],
})
export class DashboardMetricModule { }
