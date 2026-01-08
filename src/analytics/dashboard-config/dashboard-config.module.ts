import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { DashboardConfigRepository } from './repositories/dashboard-config.repository';
import { DashboardConfigService } from './services/dashboard-config.service';
import { DashboardConfigController } from './controllers/dashboard-config.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [DashboardConfigController],
    providers: [DashboardConfigRepository, DashboardConfigService],
    exports: [DashboardConfigService, DashboardConfigRepository],
})
export class DashboardConfigModule { }
