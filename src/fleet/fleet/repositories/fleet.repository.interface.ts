export interface FleetEntity {
    id: number;
    uuid: string;
    fleet_code: string;
    fleet_name: string;
    branch_id?: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}

export interface IFleetRepository {
    findAll(): Promise<FleetEntity[]>;
    findById(id: number): Promise<FleetEntity | null>;
    findByFleetCode(fleetCode: string): Promise<FleetEntity | null>;
    findActive(): Promise<FleetEntity[]>;
}
