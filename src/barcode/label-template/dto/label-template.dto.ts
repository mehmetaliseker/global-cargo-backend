import {
  IsNumber,
  IsString,
  IsUUID,
  IsOptional,
  IsBoolean,
  IsObject,
  IsArray,
} from 'class-validator';

export class LabelTemplateResponseDto {
  @IsNumber()
  id: number;

  @IsUUID()
  uuid: string;

  @IsString()
  templateName: string;

  @IsString()
  templateCode: string;

  @IsString()
  templateType: string;

  @IsObject()
  templateLayout: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  supportedLanguages?: string[];

  @IsOptional()
  @IsString()
  defaultLanguageCode?: string;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsOptional()
  @IsString()
  deletedAt?: string;
}
