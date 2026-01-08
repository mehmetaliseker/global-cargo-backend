export interface VehicleMaintenanceEntity {
    id: number;
    vehicle_id: number;
    maintenance_type: string;
    maintenance_date: Date;
    next_maintenance_date?: Date;
    cost?: number;
    description?: string;
    service_provider?: string;
    odometer_reading?: number;
    created_at: Date;
    updated_at: Date;
}

export interface IVehicleMaintenanceRepository {
    findAll(): Promise<VehicleMaintenanceEntity[]>;
    findById(id: number): Promise<VehicleMaintenanceEntity | null>;
    findByVehicleId(vehicleId: number): Promise<VehicleMaintenanceEntity[]>;
    findUpcomingMaintenance(): Promise<VehicleMaintenanceEntity[]>;
}
