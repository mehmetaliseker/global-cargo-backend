export interface PartnerCommissionEntity {
    id: number;
    partner_id: number;
    commission_type: string;
    commission_rate: number;
    applicable_to_cargo_types?: any;
    applicable_to_shipment_types?: any;
    valid_from: Date;
    valid_to?: Date;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}

export interface IPartnerCommissionRepository {
    findAll(): Promise<PartnerCommissionEntity[]>;
    findById(id: number): Promise<PartnerCommissionEntity | null>;
    findByPartnerId(partnerId: number): Promise<PartnerCommissionEntity[]>;
    findByPartnerIdActive(partnerId: number): Promise<PartnerCommissionEntity[]>;
    findActiveByDateRange(startDate: Date, endDate: Date): Promise<PartnerCommissionEntity[]>;
    findActive(): Promise<PartnerCommissionEntity[]>;
}
