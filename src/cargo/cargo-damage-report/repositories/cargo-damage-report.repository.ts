import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  CargoDamageReportEntity,
  ICargoDamageReportRepository,
} from './cargo-damage-report.repository.interface';

@Injectable()
export class CargoDamageReportRepository
  implements ICargoDamageReportRepository
{
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<CargoDamageReportEntity[]> {
    const query = `
      SELECT id, cargo_id, damage_description, severity, reported_date, reported_by, investigated_by, investigation_date, created_at, updated_at, deleted_at
      FROM cargo_damage_report
      WHERE deleted_at IS NULL
      ORDER BY reported_date DESC
    `;
    return await this.databaseService.query<CargoDamageReportEntity>(query);
  }

  async findById(id: number): Promise<CargoDamageReportEntity | null> {
    const query = `
      SELECT id, cargo_id, damage_description, severity, reported_date, reported_by, investigated_by, investigation_date, created_at, updated_at, deleted_at
      FROM cargo_damage_report
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<CargoDamageReportEntity>(
      query,
      [id],
    );
  }

  async findByCargoId(
    cargoId: number,
  ): Promise<CargoDamageReportEntity | null> {
    const query = `
      SELECT id, cargo_id, damage_description, severity, reported_date, reported_by, investigated_by, investigation_date, created_at, updated_at, deleted_at
      FROM cargo_damage_report
      WHERE cargo_id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<CargoDamageReportEntity>(
      query,
      [cargoId],
    );
  }

  async findBySeverity(severity: string): Promise<CargoDamageReportEntity[]> {
    const query = `
      SELECT id, cargo_id, damage_description, severity, reported_date, reported_by, investigated_by, investigation_date, created_at, updated_at, deleted_at
      FROM cargo_damage_report
      WHERE severity = $1 AND deleted_at IS NULL
      ORDER BY reported_date DESC
    `;
    return await this.databaseService.query<CargoDamageReportEntity>(query, [
      severity,
    ]);
  }
}

