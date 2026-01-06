import { Injectable, NotFoundException } from '@nestjs/common';
import { LanguageRepository } from '../repositories/language.repository';
import { LanguageResponseDto } from '../dto/language.dto';
import { LanguageEntity } from '../repositories/language.repository.interface';

@Injectable()
export class LanguageService {
  constructor(private readonly languageRepository: LanguageRepository) {}

  private mapToDto(entity: LanguageEntity): LanguageResponseDto {
    return {
      languageCode: entity.language_code,
      languageName: entity.language_name,
      nativeName: entity.native_name,
      isActive: entity.is_active,
      isDefault: entity.is_default,
      createdAt: entity.created_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<LanguageResponseDto[]> {
    const entities = await this.languageRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByCode(languageCode: string): Promise<LanguageResponseDto> {
    const entity = await this.languageRepository.findByCode(languageCode);
    if (!entity) {
      throw new NotFoundException(
        `Language with code ${languageCode} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findActive(): Promise<LanguageResponseDto[]> {
    const entities = await this.languageRepository.findActive();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findDefault(): Promise<LanguageResponseDto> {
    const entity = await this.languageRepository.findDefault();
    if (!entity) {
      throw new NotFoundException('Default language not found');
    }
    return this.mapToDto(entity);
  }
}

