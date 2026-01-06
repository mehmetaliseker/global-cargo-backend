export interface ShipmentTypeEntity {
  id: number;
  code: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: Date;
  deleted_at?: Date;
}

export interface IShipmentTypeRepository {
  findAll(): Promise<ShipmentTypeEntity[]>;
  findById(id: number): Promise<ShipmentTypeEntity | null>;
  findByCode(code: string): Promise<ShipmentTypeEntity | null>;
  findActive(): Promise<ShipmentTypeEntity[]>;
}

