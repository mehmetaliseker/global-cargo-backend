export interface ColdChainCargoEntity {
    id: number;
    cargo_id: number;
    required_temperature_min: number;
    required_temperature_max: number;
    temperature_unit: string;
    cold_chain_type: string;
    monitoring_required: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface IColdChainCargoRepository {
    findAll(): Promise<ColdChainCargoEntity[]>;
    findById(id: number): Promise<ColdChainCargoEntity | null>;
    findByCargoId(cargoId: number): Promise<ColdChainCargoEntity | null>;
    findByColdChainType(type: string): Promise<ColdChainCargoEntity[]>;
    findMonitoringRequired(): Promise<ColdChainCargoEntity[]>;
}
