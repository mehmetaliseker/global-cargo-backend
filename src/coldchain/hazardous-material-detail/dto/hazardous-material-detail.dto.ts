import { IsNumber, IsString, IsOptional } from 'class-validator';

export class HazardousMaterialDetailResponseDto {
    @IsNumber()
    id: number;

    @IsNumber()
    cargoId: number;

    @IsString()
    hazardClass: string;

    @IsOptional()
    @IsString()
    unNumber?: string;

    @IsOptional()
    @IsString()
    packingGroup?: string;

    @IsString()
    properShippingName: string;

    @IsOptional()
    @IsString()
    emergencyContact?: string;

    @IsOptional()
    @IsString()
    emergencyPhone?: string;

    @IsOptional()
    @IsString()
    specialInstructions?: string;

    @IsString()
    createdAt: string;

    @IsString()
    updatedAt: string;
}
