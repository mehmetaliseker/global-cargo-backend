import { Injectable, NotFoundException } from '@nestjs/common';
import { InstitutionAgreementRepository } from '../repositories/institution-agreement.repository';
import { InstitutionAgreementResponseDto } from '../dto/institution-agreement.dto';
import { InstitutionAgreementEntity } from '../repositories/institution-agreement.repository.interface';

@Injectable()
export class InstitutionAgreementService {
  constructor(
    private readonly institutionAgreementRepository: InstitutionAgreementRepository,
  ) {}

  private mapToDto(
    entity: InstitutionAgreementEntity,
  ): InstitutionAgreementResponseDto {
    return {
      id: entity.id,
      uuid: entity.uuid,
      institutionName: entity.institution_name,
      institutionCode: entity.institution_code,
      discountPercentage: parseFloat(entity.discount_percentage.toString()),
      validFrom: entity.valid_from.toISOString().split('T')[0],
      validTo: entity.valid_to
        ? entity.valid_to.toISOString().split('T')[0]
        : undefined,
      isActive: entity.is_active,
      autoApply: entity.auto_apply,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<InstitutionAgreementResponseDto[]> {
    const entities = await this.institutionAgreementRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<InstitutionAgreementResponseDto> {
    const entity = await this.institutionAgreementRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(
        `Institution agreement with id ${id} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByUuid(uuid: string): Promise<InstitutionAgreementResponseDto> {
    const entity = await this.institutionAgreementRepository.findByUuid(uuid);
    if (!entity) {
      throw new NotFoundException(
        `Institution agreement with uuid ${uuid} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByInstitutionCode(
    institutionCode: string,
  ): Promise<InstitutionAgreementResponseDto> {
    const entity =
      await this.institutionAgreementRepository.findByInstitutionCode(
        institutionCode,
      );
    if (!entity) {
      throw new NotFoundException(
        `Institution agreement with code ${institutionCode} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findActive(): Promise<InstitutionAgreementResponseDto[]> {
    const entities = await this.institutionAgreementRepository.findActive();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findActiveAndValid(): Promise<InstitutionAgreementResponseDto[]> {
    const entities =
      await this.institutionAgreementRepository.findActiveAndValid();
    return entities.map((entity) => this.mapToDto(entity));
  }
}

