export interface CargoCustomsDocumentEntity {
  id: number;
  cargo_id: number;
  customs_document_type_id: number;
  document_number?: string;
  document_data?: Record<string, unknown>;
  file_reference?: string;
  issue_date?: Date;
  expiry_date?: Date;
  is_verified: boolean;
  verified_by?: number;
  verified_at?: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface ICargoCustomsDocumentRepository {
  findAll(): Promise<CargoCustomsDocumentEntity[]>;
  findById(id: number): Promise<CargoCustomsDocumentEntity | null>;
  findByCargoId(cargoId: number): Promise<CargoCustomsDocumentEntity[]>;
  findByCargoIdAndDocumentTypeId(
    cargoId: number,
    documentTypeId: number,
  ): Promise<CargoCustomsDocumentEntity | null>;
  findByDocumentTypeId(
    documentTypeId: number,
  ): Promise<CargoCustomsDocumentEntity[]>;
  findByVerified(verified: boolean): Promise<CargoCustomsDocumentEntity[]>;
  create(
    cargoId: number,
    customsDocumentTypeId: number,
    documentNumber: string | null,
    documentData: Record<string, unknown> | null,
    fileReference: string | null,
    issueDate: Date | null,
    expiryDate: Date | null,
  ): Promise<CargoCustomsDocumentEntity>;
  update(
    id: number,
    documentNumber: string | null,
    documentData: Record<string, unknown> | null,
    fileReference: string | null,
    issueDate: Date | null,
    expiryDate: Date | null,
  ): Promise<CargoCustomsDocumentEntity>;
  verify(
    id: number,
    verifiedBy: number,
  ): Promise<CargoCustomsDocumentEntity>;
  softDelete(id: number): Promise<void>;
}

