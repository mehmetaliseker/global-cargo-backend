export interface WarehouseEntity {
    id: number;
    uuid: string;
    warehouse_code: string;
    warehouse_name: string;
    country_id: number;
    city_id?: number;
    address?: string;
    latitude?: number;
    longitude?: number;
    capacity_volume_cubic_meter?: number;
    capacity_weight_kg?: number;
    current_utilization_percentage?: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}

export interface IWarehouseRepository {
    findAll(): Promise<WarehouseEntity[]>;
    findById(id: number): Promise<WarehouseEntity | null>;
    findByUuid(uuid: string): Promise<WarehouseEntity | null>;
    findByWarehouseCode(warehouseCode: string): Promise<WarehouseEntity | null>;
    findByCountryId(countryId: number): Promise<WarehouseEntity[]>;
    findActive(): Promise<WarehouseEntity[]>;
}
