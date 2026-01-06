export type LocationType = 'branch' | 'distribution_center';

export interface CargoMovementHistoryEntity {
  id: number;
  cargo_id: number;
  location_type: LocationType;
  branch_id?: number;
  distribution_center_id?: number;
  movement_date: Date;
  status?: string;
  description?: string;
  created_at: Date;
}

export interface ICargoMovementHistoryRepository {
  findAll(): Promise<CargoMovementHistoryEntity[]>;
  findById(id: number): Promise<CargoMovementHistoryEntity | null>;
  findByCargoId(cargoId: number): Promise<CargoMovementHistoryEntity[]>;
  findByCargoIdOrdered(cargoId: number): Promise<CargoMovementHistoryEntity[]>;
}

