export interface CargoStateHistoryEntity {
  id: number;
  cargo_id: number;
  state_id: number;
  event_time: Date;
  description?: string;
  changed_by?: number;
  created_at: Date;
}

export interface ICargoStateHistoryRepository {
  findAll(): Promise<CargoStateHistoryEntity[]>;
  findById(id: number): Promise<CargoStateHistoryEntity | null>;
  findByCargoId(cargoId: number): Promise<CargoStateHistoryEntity[]>;
  findByStateId(stateId: number): Promise<CargoStateHistoryEntity[]>;
  findByCargoIdOrdered(cargoId: number): Promise<CargoStateHistoryEntity[]>;
}

