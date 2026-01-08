export interface WarehouseCapacityEntity {
    id: number;
    warehouse_id: number;
    capacity_type: string;
    max_capacity: number;
    current_usage: number;
    alert_threshold_percentage: number;
    measurement_date: Date;
    created_at: Date;
    updated_at: Date;
}

export interface IWarehouseCapacityRepository {
    findAll(): Promise<WarehouseCapacityEntity[]>;
    findById(id: number): Promise<WarehouseCapacityEntity | null>;
    findByWarehouseId(warehouseId: number): Promise<WarehouseCapacityEntity[]>;
    findByCapacityType(capacityType: string): Promise<WarehouseCapacityEntity[]>;
    findAlerts(): Promise<WarehouseCapacityEntity[]>;
}
