export interface InstitutionAgreementEntity {
  id: number;
  uuid: string;
  institution_name: string;
  institution_code?: string;
  discount_percentage: number;
  valid_from: Date;
  valid_to?: Date;
  is_active: boolean;
  auto_apply: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface IInstitutionAgreementRepository {
  findAll(): Promise<InstitutionAgreementEntity[]>;
  findById(id: number): Promise<InstitutionAgreementEntity | null>;
  findByUuid(uuid: string): Promise<InstitutionAgreementEntity | null>;
  findByInstitutionCode(institutionCode: string): Promise<InstitutionAgreementEntity | null>;
  findActive(): Promise<InstitutionAgreementEntity[]>;
  findActiveAndValid(): Promise<InstitutionAgreementEntity[]>;
}

