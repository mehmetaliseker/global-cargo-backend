import { IsNumber, IsString, IsOptional } from 'class-validator';

export class VehicleMaintenanceResponseDto {
    @IsNumber()
    id: number;

    @IsNumber()
    vehicleId: number;

    @IsString()
    maintenanceType: string;

    @IsString()
    maintenanceDate: string;

    @IsOptional()
    @IsString()
    nextMaintenanceDate?: string;

    @IsOptional()
    @IsNumber()
    cost?: number;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    serviceProvider?: string;

    @IsOptional()
    @IsNumber()
    odometerReading?: number;

    @IsString()
    createdAt: string;

    @IsString()
    updatedAt: string;
}
