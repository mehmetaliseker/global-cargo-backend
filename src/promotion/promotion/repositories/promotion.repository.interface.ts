export interface PromotionEntity {
    id: number;
    uuid: string;
    promotion_code: string;
    promotion_name: string;
    discount_type: string;
    discount_value: number;
    valid_from: Date;
    valid_to?: Date;
    usage_limit?: number;
    used_count: number;
    min_purchase_amount?: number;
    max_discount_amount?: number;
    applicable_to_cargo_types?: any;
    applicable_to_shipment_types?: any;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}

export interface IPromotionRepository {
    findAll(): Promise<PromotionEntity[]>;
    findById(id: number): Promise<PromotionEntity | null>;
    findByUuid(uuid: string): Promise<PromotionEntity | null>;
    findByPromotionCode(promotionCode: string): Promise<PromotionEntity | null>;
    findActive(): Promise<PromotionEntity[]>;
    findValidPromotions(): Promise<PromotionEntity[]>;
}
