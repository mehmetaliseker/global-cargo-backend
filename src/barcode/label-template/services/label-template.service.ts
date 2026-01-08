import { Injectable, NotFoundException } from '@nestjs/common';
import { LabelTemplateRepository } from '../repositories/label-template.repository';
import { LabelTemplateResponseDto } from '../dto/label-template.dto';
import { LabelTemplateEntity } from '../repositories/label-template.repository.interface';

@Injectable()
export class LabelTemplateService {
  constructor(
    private readonly labelTemplateRepository: LabelTemplateRepository,
  ) {}

  private mapToDto(entity: LabelTemplateEntity): LabelTemplateResponseDto {
    let templateLayout: Record<string, unknown> = {};
    if (entity.template_layout) {
      if (typeof entity.template_layout === 'string') {
        templateLayout = JSON.parse(entity.template_layout);
      } else {
        templateLayout = entity.template_layout as Record<string, unknown>;
      }
    }

    let supportedLanguages: string[] | undefined = undefined;
    if (entity.supported_languages) {
      if (typeof entity.supported_languages === 'string') {
        supportedLanguages = JSON.parse(entity.supported_languages);
      } else {
        supportedLanguages = entity.supported_languages as string[];
      }
    }

    return {
      id: entity.id,
      uuid: entity.uuid,
      templateName: entity.template_name,
      templateCode: entity.template_code,
      templateType: entity.template_type,
      templateLayout,
      supportedLanguages,
      defaultLanguageCode: entity.default_language_code ?? undefined,
      isActive: entity.is_active,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<LabelTemplateResponseDto[]> {
    const entities = await this.labelTemplateRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<LabelTemplateResponseDto> {
    const entity = await this.labelTemplateRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Label template with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByUuid(uuid: string): Promise<LabelTemplateResponseDto> {
    const entity = await this.labelTemplateRepository.findByUuid(uuid);
    if (!entity) {
      throw new NotFoundException(
        `Label template with uuid ${uuid} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByCode(templateCode: string): Promise<LabelTemplateResponseDto> {
    const entity = await this.labelTemplateRepository.findByCode(templateCode);
    if (!entity) {
      throw new NotFoundException(
        `Label template with code ${templateCode} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByType(templateType: string): Promise<LabelTemplateResponseDto[]> {
    const entities = await this.labelTemplateRepository.findByType(templateType);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findActive(): Promise<LabelTemplateResponseDto[]> {
    const entities = await this.labelTemplateRepository.findActive();
    return entities.map((entity) => this.mapToDto(entity));
  }
}
