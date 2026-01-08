import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { RouteVisualizationService } from '../services/route-visualization.service';
import { RouteVisualizationResponseDto } from '../dto/route-visualization.dto';

@Controller('analytics/route-visualizations')
export class RouteVisualizationController {
    constructor(
        private readonly routeVisualizationService: RouteVisualizationService,
    ) { }

    @Get()
    async findAll(): Promise<RouteVisualizationResponseDto[]> {
        return await this.routeVisualizationService.findAll();
    }

    @Get('route/:routeId')
    async findByRouteId(
        @Param('routeId', ParseIntPipe) routeId: number,
    ): Promise<RouteVisualizationResponseDto[]> {
        return await this.routeVisualizationService.findByRouteId(routeId);
    }

    @Get('route/:routeId/latest')
    async findByRouteIdLatest(
        @Param('routeId', ParseIntPipe) routeId: number,
    ): Promise<RouteVisualizationResponseDto | null> {
        return await this.routeVisualizationService.findByRouteIdLatest(routeId);
    }

    @Get(':id')
    async findById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<RouteVisualizationResponseDto> {
        return await this.routeVisualizationService.findById(id);
    }
}
