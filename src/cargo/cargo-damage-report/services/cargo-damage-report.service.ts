import { Injectable, NotFoundException } from '@nestjs/common';
import { CargoDamageReportRepository } from '../repositories/cargo-damage-report.repository';
import { CargoDamageReportResponseDto } from '../dto/cargo-damage-report.dto';
import { CargoDamageReportEntity } from '../repositories/cargo-damage-report.repository.interface';

@Injectable()
export class CargoDamageReportService {
  constructor(
    private readonly cargoDamageReportRepository: CargoDamageReportRepository,
  ) {}

  private mapToDto(
    entity: CargoDamageReportEntity,
  ): CargoDamageReportResponseDto {
    return {
      id: entity.id,
      cargoId: entity.cargo_id,
      damageDescription: entity.damage_description,
      severity: entity.severity,
      reportedDate: entity.reported_date.toISOString(),
      reportedBy: entity.reported_by,
      investigatedBy: entity.investigated_by,
      investigationDate: entity.investigation_date?.toISOString(),
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<CargoDamageReportResponseDto[]> {
    const entities = await this.cargoDamageReportRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<CargoDamageReportResponseDto> {
    const entity = await this.cargoDamageReportRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(
        `Cargo damage report with id ${id} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByCargoId(cargoId: number): Promise<CargoDamageReportResponseDto> {
    const entity =
      await this.cargoDamageReportRepository.findByCargoId(cargoId);
    if (!entity) {
      throw new NotFoundException(
        `Cargo damage report for cargo id ${cargoId} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findBySeverity(severity: string): Promise<CargoDamageReportResponseDto[]> {
    const entities = await this.cargoDamageReportRepository.findBySeverity(severity);
    return entities.map((entity) => this.mapToDto(entity));
  }
}

