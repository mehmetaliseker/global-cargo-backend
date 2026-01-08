import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { DashboardConfigService } from '../services/dashboard-config.service';
import { DashboardConfigResponseDto } from '../dto/dashboard-config.dto';

@Controller('analytics/dashboard-configs')
export class DashboardConfigController {
    constructor(
        private readonly dashboardConfigService: DashboardConfigService,
    ) { }

    @Get()
    async findAll(): Promise<DashboardConfigResponseDto[]> {
        return await this.dashboardConfigService.findAll();
    }

    @Get('user/:userId/:userType')
    async findByUserId(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('userType') userType: string,
    ): Promise<DashboardConfigResponseDto[]> {
        return await this.dashboardConfigService.findByUserId(userId, userType);
    }

    @Get('user/:userId/:userType/default')
    async findDefaultByUserId(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('userType') userType: string,
    ): Promise<DashboardConfigResponseDto | null> {
        return await this.dashboardConfigService.findDefaultByUserId(userId, userType);
    }

    @Get('uuid/:uuid')
    async findByUuid(
        @Param('uuid') uuid: string,
    ): Promise<DashboardConfigResponseDto> {
        return await this.dashboardConfigService.findByUuid(uuid);
    }

    @Get(':id')
    async findById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<DashboardConfigResponseDto> {
        return await this.dashboardConfigService.findById(id);
    }
}
