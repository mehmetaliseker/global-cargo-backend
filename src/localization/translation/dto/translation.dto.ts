import {
    IsNumber,
    IsString,
    IsBoolean,
    IsOptional,
} from 'class-validator';

export class TranslationResponseDto {
    @IsNumber()
    id: number;

    @IsString()
    translationKey: string;

    @IsString()
    languageCode: string;

    @IsString()
    translationValue: string;

    @IsOptional()
    @IsString()
    context?: string;

    @IsBoolean()
    isApproved: boolean;

    @IsString()
    createdAt: string;

    @IsString()
    updatedAt: string;
}
