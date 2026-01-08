import { IsNumber, IsString, IsOptional } from 'class-validator';

export class ContainerCargoAssignmentResponseDto {
    @IsNumber()
    id: number;

    @IsNumber()
    containerId: number;

    @IsNumber()
    cargoId: number;

    @IsString()
    assignedDate: string;

    @IsOptional()
    @IsString()
    loadedDate?: string;

    @IsOptional()
    @IsString()
    unloadedDate?: string;

    @IsOptional()
    @IsString()
    positionInContainer?: string;

    @IsString()
    createdAt: string;

    @IsString()
    updatedAt: string;
}
