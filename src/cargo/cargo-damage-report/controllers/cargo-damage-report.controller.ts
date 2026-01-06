import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CargoDamageReportService } from '../services/cargo-damage-report.service';
import { CargoDamageReportResponseDto } from '../dto/cargo-damage-report.dto';

@Controller('cargo/damage-reports')
export class CargoDamageReportController {
  constructor(
    private readonly cargoDamageReportService: CargoDamageReportService,
  ) {}

  @Get()
  async findAll(): Promise<CargoDamageReportResponseDto[]> {
    return await this.cargoDamageReportService.findAll();
  }

  @Get('cargo/:cargoId')
  async findByCargoId(
    @Param('cargoId', ParseIntPipe) cargoId: number,
  ): Promise<CargoDamageReportResponseDto> {
    return await this.cargoDamageReportService.findByCargoId(cargoId);
  }

  @Get('severity/:severity')
  async findBySeverity(
    @Param('severity') severity: string,
  ): Promise<CargoDamageReportResponseDto[]> {
    return await this.cargoDamageReportService.findBySeverity(severity);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CargoDamageReportResponseDto> {
    return await this.cargoDamageReportService.findById(id);
  }
}

