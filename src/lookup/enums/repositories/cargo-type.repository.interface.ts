export interface CargoTypeEntity {
  id: number;
  code: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: Date;
  deleted_at?: Date;
}

export interface ICargoTypeRepository {
  findAll(): Promise<CargoTypeEntity[]>;
  findById(id: number): Promise<CargoTypeEntity | null>;
  findByCode(code: string): Promise<CargoTypeEntity | null>;
  findActive(): Promise<CargoTypeEntity[]>;
}

