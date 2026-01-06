export interface CargoReturnRequestEntity {
  id: number;
  cargo_id: number;
  request_date: Date;
  reason: string;
  status: string;
  requested_by?: number;
  processed_by?: number;
  processed_date?: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface ICargoReturnRequestRepository {
  findAll(): Promise<CargoReturnRequestEntity[]>;
  findById(id: number): Promise<CargoReturnRequestEntity | null>;
  findByCargoId(cargoId: number): Promise<CargoReturnRequestEntity | null>;
  findByStatus(status: string): Promise<CargoReturnRequestEntity[]>;
}

