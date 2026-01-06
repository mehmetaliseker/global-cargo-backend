import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { InstitutionAgreementService } from '../services/institution-agreement.service';
import { InstitutionAgreementResponseDto } from '../dto/institution-agreement.dto';

@Controller('billing/institution-agreements')
export class InstitutionAgreementController {
  constructor(
    private readonly institutionAgreementService: InstitutionAgreementService,
  ) {}

  @Get()
  async findAll(): Promise<InstitutionAgreementResponseDto[]> {
    return await this.institutionAgreementService.findAll();
  }

  @Get('active')
  async findActive(): Promise<InstitutionAgreementResponseDto[]> {
    return await this.institutionAgreementService.findActive();
  }

  @Get('active-valid')
  async findActiveAndValid(): Promise<InstitutionAgreementResponseDto[]> {
    return await this.institutionAgreementService.findActiveAndValid();
  }

  @Get('institution-code/:institutionCode')
  async findByInstitutionCode(
    @Param('institutionCode') institutionCode: string,
  ): Promise<InstitutionAgreementResponseDto> {
    return await this.institutionAgreementService.findByInstitutionCode(
      institutionCode,
    );
  }

  @Get('uuid/:uuid')
  async findByUuid(
    @Param('uuid') uuid: string,
  ): Promise<InstitutionAgreementResponseDto> {
    return await this.institutionAgreementService.findByUuid(uuid);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<InstitutionAgreementResponseDto> {
    return await this.institutionAgreementService.findById(id);
  }
}

