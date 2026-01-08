export interface CouponEntity {
    id: number;
    uuid: string;
    coupon_code: string;
    discount_type: string;
    discount_value: number;
    valid_from: Date;
    valid_to?: Date;
    usage_limit_per_customer: number;
    min_purchase_amount?: number;
    applicable_to_cargo_types?: any;
    applicable_to_shipment_types?: any;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}

export interface ICouponRepository {
    findAll(): Promise<CouponEntity[]>;
    findById(id: number): Promise<CouponEntity | null>;
    findByUuid(uuid: string): Promise<CouponEntity | null>;
    findByCouponCode(couponCode: string): Promise<CouponEntity | null>;
    findActive(): Promise<CouponEntity[]>;
    findValidCoupons(): Promise<CouponEntity[]>;
}
