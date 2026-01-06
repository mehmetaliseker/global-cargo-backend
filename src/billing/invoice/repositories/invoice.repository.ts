import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { InvoiceEntity, IInvoiceRepository } from './invoice.repository.interface';

@Injectable()
export class InvoiceRepository implements IInvoiceRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<InvoiceEntity[]> {
    const query = `
      SELECT id, uuid, cargo_id, invoice_number, invoice_date, is_main_invoice, is_additional_invoice,
             invoice_type, subtotal, tax_amount, discount_amount, total_amount, currency_id,
             institution_agreement_id, created_at, updated_at, deleted_at
      FROM invoice
      WHERE deleted_at IS NULL
      ORDER BY invoice_date DESC
    `;
    return await this.databaseService.query<InvoiceEntity>(query);
  }

  async findById(id: number): Promise<InvoiceEntity | null> {
    const query = `
      SELECT id, uuid, cargo_id, invoice_number, invoice_date, is_main_invoice, is_additional_invoice,
             invoice_type, subtotal, tax_amount, discount_amount, total_amount, currency_id,
             institution_agreement_id, created_at, updated_at, deleted_at
      FROM invoice
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<InvoiceEntity>(query, [id]);
  }

  async findByUuid(uuid: string): Promise<InvoiceEntity | null> {
    const query = `
      SELECT id, uuid, cargo_id, invoice_number, invoice_date, is_main_invoice, is_additional_invoice,
             invoice_type, subtotal, tax_amount, discount_amount, total_amount, currency_id,
             institution_agreement_id, created_at, updated_at, deleted_at
      FROM invoice
      WHERE uuid = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<InvoiceEntity>(query, [uuid]);
  }

  async findByInvoiceNumber(
    invoiceNumber: string,
  ): Promise<InvoiceEntity | null> {
    const query = `
      SELECT id, uuid, cargo_id, invoice_number, invoice_date, is_main_invoice, is_additional_invoice,
             invoice_type, subtotal, tax_amount, discount_amount, total_amount, currency_id,
             institution_agreement_id, created_at, updated_at, deleted_at
      FROM invoice
      WHERE invoice_number = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<InvoiceEntity>(query, [
      invoiceNumber,
    ]);
  }

  async findByCargoId(cargoId: number): Promise<InvoiceEntity[]> {
    const query = `
      SELECT id, uuid, cargo_id, invoice_number, invoice_date, is_main_invoice, is_additional_invoice,
             invoice_type, subtotal, tax_amount, discount_amount, total_amount, currency_id,
             institution_agreement_id, created_at, updated_at, deleted_at
      FROM invoice
      WHERE cargo_id = $1 AND deleted_at IS NULL
      ORDER BY invoice_date DESC
    `;
    return await this.databaseService.query<InvoiceEntity>(query, [cargoId]);
  }

  async findByCargoIdMain(cargoId: number): Promise<InvoiceEntity | null> {
    const query = `
      SELECT id, uuid, cargo_id, invoice_number, invoice_date, is_main_invoice, is_additional_invoice,
             invoice_type, subtotal, tax_amount, discount_amount, total_amount, currency_id,
             institution_agreement_id, created_at, updated_at, deleted_at
      FROM invoice
      WHERE cargo_id = $1 AND is_main_invoice = true AND deleted_at IS NULL
      LIMIT 1
    `;
    return await this.databaseService.queryOne<InvoiceEntity>(query, [cargoId]);
  }

  async findByInstitutionAgreementId(
    institutionAgreementId: number,
  ): Promise<InvoiceEntity[]> {
    const query = `
      SELECT id, uuid, cargo_id, invoice_number, invoice_date, is_main_invoice, is_additional_invoice,
             invoice_type, subtotal, tax_amount, discount_amount, total_amount, currency_id,
             institution_agreement_id, created_at, updated_at, deleted_at
      FROM invoice
      WHERE institution_agreement_id = $1 AND deleted_at IS NULL
      ORDER BY invoice_date DESC
    `;
    return await this.databaseService.query<InvoiceEntity>(query, [
      institutionAgreementId,
    ]);
  }
}

