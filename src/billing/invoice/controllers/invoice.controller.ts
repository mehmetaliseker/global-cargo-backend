import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { InvoiceService } from '../services/invoice.service';
import { InvoiceResponseDto } from '../dto/invoice.dto';

@Controller('billing/invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get()
  async findAll(): Promise<InvoiceResponseDto[]> {
    return await this.invoiceService.findAll();
  }

  @Get('invoice-number/:invoiceNumber')
  async findByInvoiceNumber(
    @Param('invoiceNumber') invoiceNumber: string,
  ): Promise<InvoiceResponseDto> {
    return await this.invoiceService.findByInvoiceNumber(invoiceNumber);
  }

  @Get('cargo/:cargoId')
  async findByCargoId(
    @Param('cargoId', ParseIntPipe) cargoId: number,
  ): Promise<InvoiceResponseDto[]> {
    return await this.invoiceService.findByCargoId(cargoId);
  }

  @Get('cargo/:cargoId/main')
  async findByCargoIdMain(
    @Param('cargoId', ParseIntPipe) cargoId: number,
  ): Promise<InvoiceResponseDto> {
    return await this.invoiceService.findByCargoIdMain(cargoId);
  }

  @Get('institution-agreement/:institutionAgreementId')
  async findByInstitutionAgreementId(
    @Param('institutionAgreementId', ParseIntPipe) institutionAgreementId: number,
  ): Promise<InvoiceResponseDto[]> {
    return await this.invoiceService.findByInstitutionAgreementId(
      institutionAgreementId,
    );
  }

  @Get('uuid/:uuid')
  async findByUuid(@Param('uuid') uuid: string): Promise<InvoiceResponseDto> {
    return await this.invoiceService.findByUuid(uuid);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<InvoiceResponseDto> {
    return await this.invoiceService.findById(id);
  }
}

