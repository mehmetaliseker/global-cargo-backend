export interface MaintenanceLogEntity {
  id: number;
  maintenance_type: string;
  execution_date: Date;
  status: string;
  duration_seconds?: number;
  details?: Record<string, unknown>;
  executed_by?: string;
  created_at: Date;
  updated_at: Date;
}

export interface IMaintenanceLogRepository {
  findAll(): Promise<MaintenanceLogEntity[]>;
  findById(id: number): Promise<MaintenanceLogEntity | null>;
  findByMaintenanceType(maintenanceType: string): Promise<MaintenanceLogEntity[]>;
  findByStatus(status: string): Promise<MaintenanceLogEntity[]>;
  findByExecutionDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<MaintenanceLogEntity[]>;
}
