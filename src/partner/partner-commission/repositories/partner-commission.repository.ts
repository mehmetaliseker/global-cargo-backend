import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
    PartnerCommissionEntity,
    IPartnerCommissionRepository,
} from './partner-commission.repository.interface';

@Injectable()
export class PartnerCommissionRepository implements IPartnerCommissionRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async findAll(): Promise<PartnerCommissionEntity[]> {
        const query = `
      SELECT id, partner_id, commission_type, commission_rate,
             applicable_to_cargo_types, applicable_to_shipment_types,
             valid_from, valid_to, is_active, created_at, updated_at, deleted_at
      FROM partner_commission
      WHERE deleted_at IS NULL
      ORDER BY partner_id ASC, valid_from DESC
    `;
        return await this.databaseService.query<PartnerCommissionEntity>(query);
    }

    async findById(id: number): Promise<PartnerCommissionEntity | null> {
        const query = `
      SELECT id, partner_id, commission_type, commission_rate,
             applicable_to_cargo_types, applicable_to_shipment_types,
             valid_from, valid_to, is_active, created_at, updated_at, deleted_at
      FROM partner_commission
      WHERE id = $1 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<PartnerCommissionEntity>(query, [id]);
    }

    async findByPartnerId(partnerId: number): Promise<PartnerCommissionEntity[]> {
        const query = `
      SELECT id, partner_id, commission_type, commission_rate,
             applicable_to_cargo_types, applicable_to_shipment_types,
             valid_from, valid_to, is_active, created_at, updated_at, deleted_at
      FROM partner_commission
      WHERE partner_id = $1 AND deleted_at IS NULL
      ORDER BY valid_from DESC
    `;
        return await this.databaseService.query<PartnerCommissionEntity>(query, [partnerId]);
    }

    async findByPartnerIdActive(partnerId: number): Promise<PartnerCommissionEntity[]> {
        const query = `
      SELECT id, partner_id, commission_type, commission_rate,
             applicable_to_cargo_types, applicable_to_shipment_types,
             valid_from, valid_to, is_active, created_at, updated_at, deleted_at
      FROM partner_commission
      WHERE partner_id = $1 AND is_active = true AND deleted_at IS NULL
        AND (valid_to IS NULL OR valid_to >= CURRENT_TIMESTAMP)
        AND valid_from <= CURRENT_TIMESTAMP
      ORDER BY valid_from DESC
    `;
        return await this.databaseService.query<PartnerCommissionEntity>(query, [partnerId]);
    }

    async findActiveByDateRange(startDate: Date, endDate: Date): Promise<PartnerCommissionEntity[]> {
        const query = `
      SELECT id, partner_id, commission_type, commission_rate,
             applicable_to_cargo_types, applicable_to_shipment_types,
             valid_from, valid_to, is_active, created_at, updated_at, deleted_at
      FROM partner_commission
      WHERE is_active = true AND deleted_at IS NULL
        AND valid_from <= $2
        AND (valid_to IS NULL OR valid_to >= $1)
      ORDER BY partner_id ASC, valid_from DESC
    `;
        return await this.databaseService.query<PartnerCommissionEntity>(query, [startDate, endDate]);
    }

    async findActive(): Promise<PartnerCommissionEntity[]> {
        const query = `
      SELECT id, partner_id, commission_type, commission_rate,
             applicable_to_cargo_types, applicable_to_shipment_types,
             valid_from, valid_to, is_active, created_at, updated_at, deleted_at
      FROM partner_commission
      WHERE is_active = true AND deleted_at IS NULL
        AND (valid_to IS NULL OR valid_to >= CURRENT_TIMESTAMP)
        AND valid_from <= CURRENT_TIMESTAMP
      ORDER BY partner_id ASC, valid_from DESC
    `;
        return await this.databaseService.query<PartnerCommissionEntity>(query);
    }
}
