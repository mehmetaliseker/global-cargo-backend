import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { DashboardWidgetRepository } from './repositories/dashboard-widget.repository';
import { DashboardWidgetService } from './services/dashboard-widget.service';
import { DashboardWidgetController } from './controllers/dashboard-widget.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [DashboardWidgetController],
    providers: [DashboardWidgetRepository, DashboardWidgetService],
    exports: [DashboardWidgetService, DashboardWidgetRepository],
})
export class DashboardWidgetModule { }
