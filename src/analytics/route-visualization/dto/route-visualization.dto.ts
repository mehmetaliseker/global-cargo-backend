import {
    IsNumber,
    IsString,
    IsOptional,
    IsObject,
} from 'class-validator';

export class RouteVisualizationResponseDto {
    @IsNumber()
    id: number;

    @IsOptional()
    @IsNumber()
    routeId?: number;

    @IsObject()
    visualizationData: any;

    @IsOptional()
    @IsString()
    mapStyle?: string;

    @IsNumber()
    zoomLevel: number;

    @IsString()
    createdAt: string;

    @IsString()
    updatedAt: string;
}
