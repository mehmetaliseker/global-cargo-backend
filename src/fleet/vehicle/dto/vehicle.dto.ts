import {
    IsNumber,
    IsString,
    IsBoolean,
    IsOptional,
} from 'class-validator';

export class VehicleResponseDto {
    @IsNumber()
    id: number;

    @IsString()
    uuid: string;

    @IsString()
    vehicleCode: string;

    @IsString()
    licensePlate: string;

    @IsOptional()
    @IsNumber()
    vehicleTypeId?: number;

    @IsOptional()
    @IsString()
    vehicleTypeOverride?: string;

    @IsOptional()
    @IsString()
    brand?: string;

    @IsOptional()
    @IsString()
    model?: string;

    @IsOptional()
    @IsNumber()
    year?: number;

    @IsOptional()
    @IsNumber()
    capacityWeightKg?: number;

    @IsOptional()
    @IsNumber()
    capacityVolumeCubicMeter?: number;

    @IsBoolean()
    isActive: boolean;

    @IsBoolean()
    isInUse: boolean;

    @IsString()
    createdAt: string;

    @IsString()
    updatedAt: string;
}
