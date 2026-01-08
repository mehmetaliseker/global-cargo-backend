import { Injectable, NotFoundException } from '@nestjs/common';
import { TermsConditionsVersionRepository } from '../repositories/terms-conditions-version.repository';
import { TermsConditionsVersionResponseDto } from '../dto/terms-conditions-version.dto';
import { TermsConditionsVersionEntity } from '../repositories/terms-conditions-version.repository.interface';

@Injectable()
export class TermsConditionsVersionService {
    constructor(
        private readonly termsConditionsVersionRepository: TermsConditionsVersionRepository,
    ) { }

    private mapToDto(entity: TermsConditionsVersionEntity): TermsConditionsVersionResponseDto {
        return {
            id: entity.id,
            versionNumber: entity.version_number,
            languageCode: entity.language_code,
            content: entity.content,
            effectiveDate: entity.effective_date.toISOString().split('T')[0],
            requiresAcceptance: entity.requires_acceptance,
            isActive: entity.is_active,
            createdAt: entity.created_at.toISOString(),
            updatedAt: entity.updated_at.toISOString(),
        };
    }

    async findAll(): Promise<TermsConditionsVersionResponseDto[]> {
        const entities = await this.termsConditionsVersionRepository.findAll();
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findById(id: number): Promise<TermsConditionsVersionResponseDto> {
        const entity = await this.termsConditionsVersionRepository.findById(id);
        if (!entity) {
            throw new NotFoundException(`Terms conditions version with id ${id} not found`);
        }
        return this.mapToDto(entity);
    }

    async findByVersionNumber(versionNumber: string): Promise<TermsConditionsVersionResponseDto[]> {
        const entities = await this.termsConditionsVersionRepository.findByVersionNumber(versionNumber);
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findByVersionNumberAndLanguage(versionNumber: string, languageCode: string): Promise<TermsConditionsVersionResponseDto | null> {
        const entity = await this.termsConditionsVersionRepository.findByVersionNumberAndLanguage(versionNumber, languageCode);
        if (!entity) {
            return null;
        }
        return this.mapToDto(entity);
    }

    async findByLanguage(languageCode: string): Promise<TermsConditionsVersionResponseDto[]> {
        const entities = await this.termsConditionsVersionRepository.findByLanguage(languageCode);
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findActive(): Promise<TermsConditionsVersionResponseDto[]> {
        const entities = await this.termsConditionsVersionRepository.findActive();
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findLatestByLanguage(languageCode: string): Promise<TermsConditionsVersionResponseDto | null> {
        const entity = await this.termsConditionsVersionRepository.findLatestByLanguage(languageCode);
        if (!entity) {
            return null;
        }
        return this.mapToDto(entity);
    }
}
