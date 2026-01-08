import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { DashboardMetricService } from '../services/dashboard-metric.service';
import { DashboardMetricResponseDto } from '../dto/dashboard-metric.dto';

@Controller('analytics/metrics')
export class DashboardMetricController {
    constructor(
        private readonly dashboardMetricService: DashboardMetricService,
    ) { }

    @Get()
    async findAll(): Promise<DashboardMetricResponseDto[]> {
        return await this.dashboardMetricService.findAll();
    }

    @Get('active')
    async findActive(): Promise<DashboardMetricResponseDto[]> {
        return await this.dashboardMetricService.findActive();
    }

    @Get('type/:metricType')
    async findByMetricType(
        @Param('metricType') metricType: string,
    ): Promise<DashboardMetricResponseDto[]> {
        return await this.dashboardMetricService.findByMetricType(metricType);
    }

    @Get('code/:metricCode')
    async findByMetricCode(
        @Param('metricCode') metricCode: string,
    ): Promise<DashboardMetricResponseDto> {
        return await this.dashboardMetricService.findByMetricCode(metricCode);
    }

    @Get(':id')
    async findById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<DashboardMetricResponseDto> {
        return await this.dashboardMetricService.findById(id);
    }
}
