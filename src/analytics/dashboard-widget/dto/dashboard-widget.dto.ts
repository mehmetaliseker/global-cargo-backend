import {
    IsNumber,
    IsString,
    IsOptional,
    IsObject,
} from 'class-validator';

export class DashboardWidgetResponseDto {
    @IsNumber()
    id: number;

    @IsNumber()
    dashboardConfigId: number;

    @IsString()
    widgetType: string;

    @IsObject()
    widgetConfig: any;

    @IsNumber()
    positionX: number;

    @IsNumber()
    positionY: number;

    @IsNumber()
    width: number;

    @IsNumber()
    height: number;

    @IsNumber()
    refreshIntervalSeconds: number;

    @IsNumber()
    widgetOrder: number;

    @IsString()
    createdAt: string;

    @IsString()
    updatedAt: string;
}
