export interface ContainerEntity {
    id: number;
    uuid: string;
    container_code: string;
    container_type?: string;
    warehouse_id?: number;
    dimensions_length_cm?: number;
    dimensions_width_cm?: number;
    dimensions_height_cm?: number;
    weight_capacity_kg?: number;
    volume_capacity_cubic_meter?: number;
    is_active: boolean;
    is_in_use: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}

export interface IContainerRepository {
    findAll(): Promise<ContainerEntity[]>;
    findById(id: number): Promise<ContainerEntity | null>;
    findByUuid(uuid: string): Promise<ContainerEntity | null>;
    findByContainerCode(containerCode: string): Promise<ContainerEntity | null>;
    findByWarehouseId(warehouseId: number): Promise<ContainerEntity[]>;
    findActive(): Promise<ContainerEntity[]>;
    findInUse(): Promise<ContainerEntity[]>;
}
