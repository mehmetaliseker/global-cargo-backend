import {
    IsNumber,
    IsString,
    IsOptional,
    IsObject,
} from 'class-validator';

export class TimeSeriesDataResponseDto {
    @IsNumber()
    id: number;

    @IsString()
    entityType: string;

    @IsOptional()
    @IsNumber()
    entityId?: number;

    @IsString()
    metricName: string;

    @IsNumber()
    metricValue: number;

    @IsString()
    timestamp: string;

    @IsOptional()
    @IsObject()
    additionalData?: any;

    @IsString()
    createdAt: string;
}
