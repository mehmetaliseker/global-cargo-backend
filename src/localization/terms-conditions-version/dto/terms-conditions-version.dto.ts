import {
    IsNumber,
    IsString,
    IsBoolean,
    IsDateString,
} from 'class-validator';

export class TermsConditionsVersionResponseDto {
    @IsNumber()
    id: number;

    @IsString()
    versionNumber: string;

    @IsString()
    languageCode: string;

    @IsString()
    content: string;

    @IsDateString()
    effectiveDate: string;

    @IsBoolean()
    requiresAcceptance: boolean;

    @IsBoolean()
    isActive: boolean;

    @IsString()
    createdAt: string;

    @IsString()
    updatedAt: string;
}
