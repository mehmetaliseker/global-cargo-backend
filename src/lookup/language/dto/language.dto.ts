import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class LanguageResponseDto {
  @IsString()
  languageCode: string;

  @IsString()
  languageName: string;

  @IsOptional()
  @IsString()
  nativeName?: string;

  @IsBoolean()
  isActive: boolean;

  @IsBoolean()
  isDefault: boolean;

  @IsString()
  createdAt: string;

  @IsOptional()
  @IsString()
  deletedAt?: string;
}

