import {
    IsNumber,
    IsString,
    IsBoolean,
    IsOptional,
    IsObject,
} from 'class-validator';

export class RegionalConfigResponseDto {
    @IsNumber()
    id: number;

    @IsOptional()
    @IsNumber()
    countryId?: number;

    @IsOptional()
    @IsNumber()
    regionId?: number;

    @IsString()
    configKey: string;

    @IsObject()
    configValue: any;

    @IsOptional()
    @IsString()
    description?: string;

    @IsBoolean()
    isActive: boolean;

    @IsString()
    createdAt: string;

    @IsString()
    updatedAt: string;
}
