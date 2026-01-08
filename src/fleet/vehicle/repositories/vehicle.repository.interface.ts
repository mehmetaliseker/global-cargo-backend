export interface VehicleEntity {
    id: number;
    uuid: string;
    vehicle_code: string;
    license_plate: string;
    vehicle_type_id?: number;
    vehicle_type_override?: string;
    brand?: string;
    model?: string;
    year?: number;
    capacity_weight_kg?: number;
    capacity_volume_cubic_meter?: number;
    is_active: boolean;
    is_in_use: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}

export interface IVehicleRepository {
    findAll(): Promise<VehicleEntity[]>;
    findById(id: number): Promise<VehicleEntity | null>;
    findByUuid(uuid: string): Promise<VehicleEntity | null>;
    findByVehicleCode(vehicleCode: string): Promise<VehicleEntity | null>;
    findByLicensePlate(licensePlate: string): Promise<VehicleEntity | null>;
    findActive(): Promise<VehicleEntity[]>;
    findInUse(): Promise<VehicleEntity[]>;
}
