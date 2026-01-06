import { Injectable, NotFoundException } from '@nestjs/common';
import { InvoiceRepository } from '../repositories/invoice.repository';
import { InvoiceResponseDto } from '../dto/invoice.dto';
import { InvoiceEntity } from '../repositories/invoice.repository.interface';

@Injectable()
export class InvoiceService {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  private mapToDto(entity: InvoiceEntity): InvoiceResponseDto {
    return {
      id: entity.id,
      uuid: entity.uuid,
      cargoId: entity.cargo_id,
      invoiceNumber: entity.invoice_number,
      invoiceDate: entity.invoice_date.toISOString(),
      isMainInvoice: entity.is_main_invoice,
      isAdditionalInvoice: entity.is_additional_invoice,
      invoiceType: entity.invoice_type,
      subtotal: parseFloat(entity.subtotal.toString()),
      taxAmount: parseFloat(entity.tax_amount.toString()),
      discountAmount: parseFloat(entity.discount_amount.toString()),
      totalAmount: parseFloat(entity.total_amount.toString()),
      currencyId: entity.currency_id,
      institutionAgreementId: entity.institution_agreement_id,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<InvoiceResponseDto[]> {
    const entities = await this.invoiceRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<InvoiceResponseDto> {
    const entity = await this.invoiceRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Invoice with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByUuid(uuid: string): Promise<InvoiceResponseDto> {
    const entity = await this.invoiceRepository.findByUuid(uuid);
    if (!entity) {
      throw new NotFoundException(`Invoice with uuid ${uuid} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByInvoiceNumber(
    invoiceNumber: string,
  ): Promise<InvoiceResponseDto> {
    const entity =
      await this.invoiceRepository.findByInvoiceNumber(invoiceNumber);
    if (!entity) {
      throw new NotFoundException(
        `Invoice with invoice number ${invoiceNumber} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByCargoId(cargoId: number): Promise<InvoiceResponseDto[]> {
    const entities = await this.invoiceRepository.findByCargoId(cargoId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByCargoIdMain(cargoId: number): Promise<InvoiceResponseDto> {
    const entity = await this.invoiceRepository.findByCargoIdMain(cargoId);
    if (!entity) {
      throw new NotFoundException(
        `Main invoice for cargo id ${cargoId} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByInstitutionAgreementId(
    institutionAgreementId: number,
  ): Promise<InvoiceResponseDto[]> {
    const entities =
      await this.invoiceRepository.findByInstitutionAgreementId(
        institutionAgreementId,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }
}

