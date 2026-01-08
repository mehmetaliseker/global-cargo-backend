import { IsNumber, IsString, IsBoolean, IsOptional } from 'class-validator';

export class FleetResponseDto {
    @IsNumber()
    id: number;

    @IsString()
    uuid: string;

    @IsString()
    fleetCode: string;

    @IsString()
    fleetName: string;

    @IsOptional()
    @IsNumber()
    branchId?: number;

    @IsBoolean()
    isActive: boolean;

    @IsString()
    createdAt: string;

    @IsString()
    updatedAt: string;
}
