import {
    IsNumber,
    IsString,
    IsOptional,
} from 'class-validator';

export class GeoCoordinateResponseDto {
    @IsNumber()
    id: number;

    @IsString()
    entityType: string;

    @IsNumber()
    entityId: number;

    @IsNumber()
    latitude: number;

    @IsNumber()
    longitude: number;

    @IsOptional()
    @IsNumber()
    accuracyMeters?: number;

    @IsString()
    recordedAt: string;

    @IsString()
    createdAt: string;
}
