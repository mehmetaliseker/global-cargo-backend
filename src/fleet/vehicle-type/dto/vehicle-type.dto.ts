import {
    IsNumber,
    IsString,
    IsBoolean,
    IsOptional,
} from 'class-validator';

export class VehicleTypeResponseDto {
    @IsNumber()
    id: number;

    @IsString()
    typeCode: string;

    @IsString()
    typeName: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    defaultCapacityWeightKg?: number;

    @IsOptional()
    @IsNumber()
    defaultCapacityVolumeCubicMeter?: number;

    @IsBoolean()
    isActive: boolean;

    @IsString()
    createdAt: string;

    @IsString()
    updatedAt: string;
}
