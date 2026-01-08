import {
    IsNumber,
    IsString,
    IsBoolean,
    IsOptional,
} from 'class-validator';

export class LocaleSettingResponseDto {
    @IsNumber()
    id: number;

    @IsString()
    localeCode: string;

    @IsOptional()
    @IsNumber()
    countryId?: number;

    @IsString()
    dateFormat: string;

    @IsString()
    timeFormat: string;

    @IsString()
    currencyFormat: string;

    @IsString()
    numberFormat: string;

    @IsOptional()
    @IsString()
    timezone?: string;

    @IsBoolean()
    isActive: boolean;

    @IsString()
    createdAt: string;

    @IsString()
    updatedAt: string;
}
