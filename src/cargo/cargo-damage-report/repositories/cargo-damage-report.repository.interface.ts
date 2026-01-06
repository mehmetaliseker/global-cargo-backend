export interface CargoDamageReportEntity {
  id: number;
  cargo_id: number;
  damage_description: string;
  severity?: string;
  reported_date: Date;
  reported_by?: number;
  investigated_by?: number;
  investigation_date?: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface ICargoDamageReportRepository {
  findAll(): Promise<CargoDamageReportEntity[]>;
  findById(id: number): Promise<CargoDamageReportEntity | null>;
  findByCargoId(cargoId: number): Promise<CargoDamageReportEntity | null>;
  findBySeverity(severity: string): Promise<CargoDamageReportEntity[]>;
}

