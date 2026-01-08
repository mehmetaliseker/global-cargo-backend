import {
    IsNumber,
    IsString,
    IsBoolean,
    IsOptional,
} from 'class-validator';

export class WarehouseLocationResponseDto {
    @IsNumber()
    id: number;

    @IsNumber()
    warehouseId: number;

    @IsString()
    locationCode: string;

    @IsOptional()
    @IsString()
    locationType?: string;

    @IsOptional()
    @IsNumber()
    coordinatesX?: number;

    @IsOptional()
    @IsNumber()
    coordinatesY?: number;

    @IsOptional()
    @IsNumber()
    coordinatesZ?: number;

    @IsOptional()
    @IsNumber()
    capacityVolume?: number;

    @IsOptional()
    @IsNumber()
    capacityWeight?: number;

    @IsBoolean()
    isActive: boolean;

    @IsString()
    createdAt: string;

    @IsString()
    updatedAt: string;
}
