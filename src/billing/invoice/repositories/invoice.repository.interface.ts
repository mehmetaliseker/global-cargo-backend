export interface InvoiceEntity {
  id: number;
  uuid: string;
  cargo_id: number;
  invoice_number: string;
  invoice_date: Date;
  is_main_invoice: boolean;
  is_additional_invoice: boolean;
  invoice_type?: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  currency_id: number;
  institution_agreement_id?: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface IInvoiceRepository {
  findAll(): Promise<InvoiceEntity[]>;
  findById(id: number): Promise<InvoiceEntity | null>;
  findByUuid(uuid: string): Promise<InvoiceEntity | null>;
  findByInvoiceNumber(invoiceNumber: string): Promise<InvoiceEntity | null>;
  findByCargoId(cargoId: number): Promise<InvoiceEntity[]>;
  findByCargoIdMain(cargoId: number): Promise<InvoiceEntity | null>;
  findByInstitutionAgreementId(
    institutionAgreementId: number,
  ): Promise<InvoiceEntity[]>;
}

