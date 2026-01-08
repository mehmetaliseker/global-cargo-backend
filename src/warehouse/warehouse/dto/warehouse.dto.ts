import {
    IsNumber,
    IsString,
    IsBoolean,
    IsOptional,
} from 'class-validator';

export class WarehouseResponseDto {
    @IsNumber()
    id: number;

    @IsString()
    uuid: string;

    @IsString()
    warehouseCode: string;

    @IsString()
    warehouseName: string;

    @IsNumber()
    countryId: number;

    @IsOptional()
    @IsNumber()
    cityId?: number;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsNumber()
    latitude?: number;

    @IsOptional()
    @IsNumber()
    longitude?: number;

    @IsOptional()
    @IsNumber()
    capacityVolumeCubicMeter?: number;

    @IsOptional()
    @IsNumber()
    capacityWeightKg?: number;

    @IsOptional()
    @IsNumber()
    currentUtilizationPercentage?: number;

    @IsBoolean()
    isActive: boolean;

    @IsString()
    createdAt: string;

    @IsString()
    updatedAt: string;
}
