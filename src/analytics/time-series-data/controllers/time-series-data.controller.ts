import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { TimeSeriesDataService } from '../services/time-series-data.service';
import { TimeSeriesDataResponseDto } from '../dto/time-series-data.dto';

@Controller('analytics/time-series')
export class TimeSeriesDataController {
    constructor(
        private readonly timeSeriesDataService: TimeSeriesDataService,
    ) { }

    @Get()
    async findAll(): Promise<TimeSeriesDataResponseDto[]> {
        return await this.timeSeriesDataService.findAll();
    }

    @Get('date-range')
    async findByDateRange(
        @Query('start') startDate: string,
        @Query('end') endDate: string,
    ): Promise<TimeSeriesDataResponseDto[]> {
        return await this.timeSeriesDataService.findByDateRange(startDate, endDate);
    }

    @Get('metric/:metricName')
    async findByMetricName(
        @Param('metricName') metricName: string,
    ): Promise<TimeSeriesDataResponseDto[]> {
        return await this.timeSeriesDataService.findByMetricName(metricName);
    }

    @Get('entity/:entityType/:entityId')
    async findByEntity(
        @Param('entityType') entityType: string,
        @Param('entityId', ParseIntPipe) entityId: number,
    ): Promise<TimeSeriesDataResponseDto[]> {
        return await this.timeSeriesDataService.findByEntity(entityType, entityId);
    }

    @Get('entity/:entityType/:entityId/date-range')
    async findByEntityAndDateRange(
        @Param('entityType') entityType: string,
        @Param('entityId', ParseIntPipe) entityId: number,
        @Query('start') startDate: string,
        @Query('end') endDate: string,
    ): Promise<TimeSeriesDataResponseDto[]> {
        return await this.timeSeriesDataService.findByEntityAndDateRange(
            entityType,
            entityId,
            startDate,
            endDate,
        );
    }

    @Get(':id')
    async findById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<TimeSeriesDataResponseDto> {
        return await this.timeSeriesDataService.findById(id);
    }
}
