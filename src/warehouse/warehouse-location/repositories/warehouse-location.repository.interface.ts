export interface WarehouseLocationEntity {
    id: number;
    warehouse_id: number;
    location_code: string;
    location_type?: string;
    coordinates_x?: number;
    coordinates_y?: number;
    coordinates_z?: number;
    capacity_volume?: number;
    capacity_weight?: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}

export interface IWarehouseLocationRepository {
    findAll(): Promise<WarehouseLocationEntity[]>;
    findById(id: number): Promise<WarehouseLocationEntity | null>;
    findByWarehouseId(warehouseId: number): Promise<WarehouseLocationEntity[]>;
    findByLocationCode(warehouseId: number, locationCode: string): Promise<WarehouseLocationEntity | null>;
    findActive(): Promise<WarehouseLocationEntity[]>;
}
