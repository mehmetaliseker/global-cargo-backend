export interface VehicleCargoAssignmentEntity {
    id: number;
    vehicle_id: number;
    cargo_id: number;
    route_id?: number;
    assigned_date: Date;
    loaded_date?: Date;
    unloaded_date?: Date;
    created_at: Date;
    updated_at: Date;
}

export interface IVehicleCargoAssignmentRepository {
    findAll(): Promise<VehicleCargoAssignmentEntity[]>;
    findById(id: number): Promise<VehicleCargoAssignmentEntity | null>;
    findByVehicleId(vehicleId: number): Promise<VehicleCargoAssignmentEntity[]>;
    findByCargoId(cargoId: number): Promise<VehicleCargoAssignmentEntity[]>;
    findByRouteId(routeId: number): Promise<VehicleCargoAssignmentEntity[]>;
}
