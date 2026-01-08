import {
    IsNumber,
    IsString,
    IsBoolean,
    IsOptional,
    IsObject,
    IsIn,
} from 'class-validator';

export class DashboardMetricResponseDto {
    @IsNumber()
    id: number;

    @IsString()
    metricCode: string;

    @IsString()
    metricName: string;

    @IsString()
    @IsIn(['count', 'sum', 'average', 'percentage', 'ratio', 'trend'])
    metricType: string;

    @IsString()
    dataSource: string;

    @IsOptional()
    @IsObject()
    calculationQuery?: any;

    @IsNumber()
    refreshIntervalSeconds: number;

    @IsBoolean()
    isActive: boolean;

    @IsString()
    createdAt: string;

    @IsString()
    updatedAt: string;
}
