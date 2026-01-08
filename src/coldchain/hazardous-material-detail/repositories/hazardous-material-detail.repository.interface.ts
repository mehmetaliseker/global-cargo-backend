export interface HazardousMaterialDetailEntity {
    id: number;
    cargo_id: number;
    hazard_class: string;
    un_number?: string;
    packing_group?: string;
    proper_shipping_name: string;
    emergency_contact?: string;
    emergency_phone?: string;
    special_instructions?: string;
    created_at: Date;
    updated_at: Date;
}

export interface IHazardousMaterialDetailRepository {
    findAll(): Promise<HazardousMaterialDetailEntity[]>;
    findById(id: number): Promise<HazardousMaterialDetailEntity | null>;
    findByCargoId(cargoId: number): Promise<HazardousMaterialDetailEntity | null>;
    findByHazardClass(hazardClass: string): Promise<HazardousMaterialDetailEntity[]>;
}
