import {
    IsNumber,
    IsString,
    IsBoolean,
} from 'class-validator';

export class LocalizedContentResponseDto {
    @IsNumber()
    id: number;

    @IsString()
    contentType: string;

    @IsString()
    contentKey: string;

    @IsString()
    languageCode: string;

    @IsString()
    contentValue: string;

    @IsBoolean()
    isActive: boolean;

    @IsString()
    createdAt: string;

    @IsString()
    updatedAt: string;
}
