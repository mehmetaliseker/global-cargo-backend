import {
    IsNumber,
    IsString,
    IsBoolean,
    IsOptional,
} from 'class-validator';

export class ContainerResponseDto {
    @IsNumber()
    id: number;

    @IsString()
    uuid: string;

    @IsString()
    containerCode: string;

    @IsOptional()
    @IsString()
    containerType?: string;

    @IsOptional()
    @IsNumber()
    warehouseId?: number;

    @IsOptional()
    @IsNumber()
    dimensionsLengthCm?: number;

    @IsOptional()
    @IsNumber()
    dimensionsWidthCm?: number;

    @IsOptional()
    @IsNumber()
    dimensionsHeightCm?: number;

    @IsOptional()
    @IsNumber()
    weightCapacityKg?: number;

    @IsOptional()
    @IsNumber()
    volumeCapacityCubicMeter?: number;

    @IsBoolean()
    isActive: boolean;

    @IsBoolean()
    isInUse: boolean;

    @IsString()
    createdAt: string;

    @IsString()
    updatedAt: string;
}
