import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { GeoCoordinateService } from '../services/geo-coordinate.service';
import { GeoCoordinateResponseDto } from '../dto/geo-coordinate.dto';

@Controller('analytics/geo-coordinates')
export class GeoCoordinateController {
    constructor(
        private readonly geoCoordinateService: GeoCoordinateService,
    ) { }

    @Get()
    async findAll(): Promise<GeoCoordinateResponseDto[]> {
        return await this.geoCoordinateService.findAll();
    }

    @Get('entity/:entityType/:entityId')
    async findByEntity(
        @Param('entityType') entityType: string,
        @Param('entityId', ParseIntPipe) entityId: number,
    ): Promise<GeoCoordinateResponseDto[]> {
        return await this.geoCoordinateService.findByEntity(entityType, entityId);
    }

    @Get('entity/:entityType/:entityId/latest')
    async findByEntityLatest(
        @Param('entityType') entityType: string,
        @Param('entityId', ParseIntPipe) entityId: number,
    ): Promise<GeoCoordinateResponseDto | null> {
        return await this.geoCoordinateService.findByEntityLatest(entityType, entityId);
    }

    @Get('date-range')
    async findByDateRange(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
    ): Promise<GeoCoordinateResponseDto[]> {
        return await this.geoCoordinateService.findByDateRange(startDate, endDate);
    }

    @Get('entity/:entityType/:entityId/date-range')
    async findByEntityAndDateRange(
        @Param('entityType') entityType: string,
        @Param('entityId', ParseIntPipe) entityId: number,
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
    ): Promise<GeoCoordinateResponseDto[]> {
        return await this.geoCoordinateService.findByEntityAndDateRange(entityType, entityId, startDate, endDate);
    }

    @Get(':id')
    async findById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<GeoCoordinateResponseDto> {
        return await this.geoCoordinateService.findById(id);
    }
}
