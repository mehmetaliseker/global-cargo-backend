import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  InstitutionAgreementEntity,
  IInstitutionAgreementRepository,
} from './institution-agreement.repository.interface';

@Injectable()
export class InstitutionAgreementRepository
  implements IInstitutionAgreementRepository
{
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<InstitutionAgreementEntity[]> {
    const query = `
      SELECT id, uuid, institution_name, institution_code, discount_percentage, valid_from, valid_to,
             is_active, auto_apply, created_at, updated_at, deleted_at
      FROM institution_agreement
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<InstitutionAgreementEntity>(
      query,
    );
  }

  async findById(id: number): Promise<InstitutionAgreementEntity | null> {
    const query = `
      SELECT id, uuid, institution_name, institution_code, discount_percentage, valid_from, valid_to,
             is_active, auto_apply, created_at, updated_at, deleted_at
      FROM institution_agreement
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<InstitutionAgreementEntity>(
      query,
      [id],
    );
  }

  async findByUuid(uuid: string): Promise<InstitutionAgreementEntity | null> {
    const query = `
      SELECT id, uuid, institution_name, institution_code, discount_percentage, valid_from, valid_to,
             is_active, auto_apply, created_at, updated_at, deleted_at
      FROM institution_agreement
      WHERE uuid = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<InstitutionAgreementEntity>(
      query,
      [uuid],
    );
  }

  async findByInstitutionCode(
    institutionCode: string,
  ): Promise<InstitutionAgreementEntity | null> {
    const query = `
      SELECT id, uuid, institution_name, institution_code, discount_percentage, valid_from, valid_to,
             is_active, auto_apply, created_at, updated_at, deleted_at
      FROM institution_agreement
      WHERE institution_code = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<InstitutionAgreementEntity>(
      query,
      [institutionCode],
    );
  }

  async findActive(): Promise<InstitutionAgreementEntity[]> {
    const query = `
      SELECT id, uuid, institution_name, institution_code, discount_percentage, valid_from, valid_to,
             is_active, auto_apply, created_at, updated_at, deleted_at
      FROM institution_agreement
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<InstitutionAgreementEntity>(query);
  }

  async findActiveAndValid(): Promise<InstitutionAgreementEntity[]> {
    const query = `
      SELECT id, uuid, institution_name, institution_code, discount_percentage, valid_from, valid_to,
             is_active, auto_apply, created_at, updated_at, deleted_at
      FROM institution_agreement
      WHERE is_active = true 
        AND valid_from <= CURRENT_DATE
        AND (valid_to IS NULL OR valid_to >= CURRENT_DATE)
        AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<InstitutionAgreementEntity>(query);
  }
}

