export interface VehicleTypeEntity {
    id: number;
    type_code: string;
    type_name: string;
    description?: string;
    default_capacity_weight_kg?: number;
    default_capacity_volume_cubic_meter?: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}

export interface IVehicleTypeRepository {
    findAll(): Promise<VehicleTypeEntity[]>;
    findById(id: number): Promise<VehicleTypeEntity | null>;
    findByTypeCode(typeCode: string): Promise<VehicleTypeEntity | null>;
    findActive(): Promise<VehicleTypeEntity[]>;
}
