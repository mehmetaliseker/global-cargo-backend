import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
    PromotionEntity,
    IPromotionRepository,
} from './promotion.repository.interface';

@Injectable()
export class PromotionRepository implements IPromotionRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async findAll(): Promise<PromotionEntity[]> {
        const query = `
      SELECT id, uuid, promotion_code, promotion_name, discount_type,
             discount_value, valid_from, valid_to, usage_limit, used_count,
             min_purchase_amount, max_discount_amount, applicable_to_cargo_types,
             applicable_to_shipment_types, is_active, created_at, updated_at, deleted_at
      FROM promotion
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `;
        return await this.databaseService.query<PromotionEntity>(query);
    }

    async findById(id: number): Promise<PromotionEntity | null> {
        const query = `
      SELECT id, uuid, promotion_code, promotion_name, discount_type,
             discount_value, valid_from, valid_to, usage_limit, used_count,
             min_purchase_amount, max_discount_amount, applicable_to_cargo_types,
             applicable_to_shipment_types, is_active, created_at, updated_at, deleted_at
      FROM promotion
      WHERE id = $1 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<PromotionEntity>(query, [id]);
    }

    async findByUuid(uuid: string): Promise<PromotionEntity | null> {
        const query = `
      SELECT id, uuid, promotion_code, promotion_name, discount_type,
             discount_value, valid_from, valid_to, usage_limit, used_count,
             min_purchase_amount, max_discount_amount, applicable_to_cargo_types,
             applicable_to_shipment_types, is_active, created_at, updated_at, deleted_at
      FROM promotion
      WHERE uuid = $1 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<PromotionEntity>(query, [uuid]);
    }

    async findByPromotionCode(
        promotionCode: string,
    ): Promise<PromotionEntity | null> {
        const query = `
      SELECT id, uuid, promotion_code, promotion_name, discount_type,
             discount_value, valid_from, valid_to, usage_limit, used_count,
             min_purchase_amount, max_discount_amount, applicable_to_cargo_types,
             applicable_to_shipment_types, is_active, created_at, updated_at, deleted_at
      FROM promotion
      WHERE promotion_code = $1 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<PromotionEntity>(query, [
            promotionCode,
        ]);
    }

    async findActive(): Promise<PromotionEntity[]> {
        const query = `
      SELECT id, uuid, promotion_code, promotion_name, discount_type,
             discount_value, valid_from, valid_to, usage_limit, used_count,
             min_purchase_amount, max_discount_amount, applicable_to_cargo_types,
             applicable_to_shipment_types, is_active, created_at, updated_at, deleted_at
      FROM promotion
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
        return await this.databaseService.query<PromotionEntity>(query);
    }

    async findValidPromotions(): Promise<PromotionEntity[]> {
        const query = `
      SELECT id, uuid, promotion_code, promotion_name, discount_type,
             discount_value, valid_from, valid_to, usage_limit, used_count,
             min_purchase_amount, max_discount_amount, applicable_to_cargo_types,
             applicable_to_shipment_types, is_active, created_at, updated_at, deleted_at
      FROM promotion
      WHERE is_active = true
        AND deleted_at IS NULL
        AND valid_from <= CURRENT_TIMESTAMP
        AND (valid_to IS NULL OR valid_to >= CURRENT_TIMESTAMP)
        AND (usage_limit IS NULL OR used_count < usage_limit)
      ORDER BY created_at DESC
    `;
        return await this.databaseService.query<PromotionEntity>(query);
    }
}
