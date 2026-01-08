import { IsNumber, IsString, IsOptional } from 'class-validator';

export class VehicleCargoAssignmentResponseDto {
    @IsNumber()
    id: number;

    @IsNumber()
    vehicleId: number;

    @IsNumber()
    cargoId: number;

    @IsOptional()
    @IsNumber()
    routeId?: number;

    @IsString()
    assignedDate: string;

    @IsOptional()
    @IsString()
    loadedDate?: string;

    @IsOptional()
    @IsString()
    unloadedDate?: string;

    @IsString()
    createdAt: string;

    @IsString()
    updatedAt: string;
}
