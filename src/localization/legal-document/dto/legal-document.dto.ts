import {
    IsNumber,
    IsString,
    IsBoolean,
    IsUUID,
    IsDateString,
} from 'class-validator';

export class LegalDocumentResponseDto {
    @IsNumber()
    id: number;

    @IsUUID()
    uuid: string;

    @IsString()
    documentType: string;

    @IsString()
    documentName: string;

    @IsString()
    languageCode: string;

    @IsString()
    content: string;

    @IsString()
    version: string;

    @IsDateString()
    effectiveDate: string;

    @IsBoolean()
    isActive: boolean;

    @IsString()
    createdAt: string;

    @IsString()
    updatedAt: string;
}
