import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { DashboardWidgetService } from '../services/dashboard-widget.service';
import { DashboardWidgetResponseDto } from '../dto/dashboard-widget.dto';

@Controller('analytics/dashboard-widgets')
export class DashboardWidgetController {
    constructor(
        private readonly dashboardWidgetService: DashboardWidgetService,
    ) { }

    @Get()
    async findAll(): Promise<DashboardWidgetResponseDto[]> {
        return await this.dashboardWidgetService.findAll();
    }

    @Get('dashboard-config/:dashboardConfigId')
    async findByDashboardConfigId(
        @Param('dashboardConfigId', ParseIntPipe) dashboardConfigId: number,
    ): Promise<DashboardWidgetResponseDto[]> {
        return await this.dashboardWidgetService.findByDashboardConfigId(dashboardConfigId);
    }

    @Get('dashboard-config/:dashboardConfigId/ordered')
    async findByDashboardConfigIdOrdered(
        @Param('dashboardConfigId', ParseIntPipe) dashboardConfigId: number,
    ): Promise<DashboardWidgetResponseDto[]> {
        return await this.dashboardWidgetService.findByDashboardConfigIdOrdered(dashboardConfigId);
    }

    @Get(':id')
    async findById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<DashboardWidgetResponseDto> {
        return await this.dashboardWidgetService.findById(id);
    }
}
