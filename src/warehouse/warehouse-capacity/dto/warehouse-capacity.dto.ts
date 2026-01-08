import { IsNumber, IsString, IsIn } from 'class-validator';

export class WarehouseCapacityResponseDto {
    @IsNumber()
    id: number;

    @IsNumber()
    warehouseId: number;

    @IsString()
    @IsIn(['volume', 'weight', 'area'])
    capacityType: string;

    @IsNumber()
    maxCapacity: number;

    @IsNumber()
    currentUsage: number;

    @IsNumber()
    alertThresholdPercentage: number;

    @IsString()
    measurementDate: string;

    @IsString()
    createdAt: string;

    @IsString()
    updatedAt: string;
}
