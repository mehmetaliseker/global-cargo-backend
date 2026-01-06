export interface CargoEventLogEntity {
  id: number;
  cargo_id: number;
  event_type: string;
  event_description?: string;
  event_time: Date;
  location_id?: number;
  location_type?: string;
  employee_id?: number;
  created_at: Date;
}

export interface ICargoEventLogRepository {
  findAll(): Promise<CargoEventLogEntity[]>;
  findById(id: number): Promise<CargoEventLogEntity | null>;
  findByCargoId(cargoId: number): Promise<CargoEventLogEntity[]>;
  findByEventType(eventType: string): Promise<CargoEventLogEntity[]>;
  findByCargoIdOrdered(cargoId: number): Promise<CargoEventLogEntity[]>;
}

