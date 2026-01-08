import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
    HazardousMaterialDetailEntity,
    IHazardousMaterialDetailRepository,
} from './hazardous-material-detail.repository.interface';

@Injectable()
export class HazardousMaterialDetailRepository
    implements IHazardousMaterialDetailRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async findAll(): Promise<HazardousMaterialDetailEntity[]> {
        const query = `
      SELECT id, cargo_id, hazard_class, un_number, packing_group,
             proper_shipping_name, emergency_contact, emergency_phone,
             special_instructions, created_at, updated_at
      FROM hazardous_material_detail
      ORDER BY created_at DESC
    `;
        return await this.databaseService.query<HazardousMaterialDetailEntity>(
            query,
        );
    }

    async findById(id: number): Promise<HazardousMaterialDetailEntity | null> {
        const query = `
      SELECT id, cargo_id, hazard_class, un_number, packing_group,
             proper_shipping_name, emergency_contact, emergency_phone,
             special_instructions, created_at, updated_at
      FROM hazardous_material_detail
      WHERE id = $1
    `;
        return await this.databaseService.queryOne<HazardousMaterialDetailEntity>(
            query,
            [id],
        );
    }

    async findByCargoId(
        cargoId: number,
    ): Promise<HazardousMaterialDetailEntity | null> {
        const query = `
      SELECT id, cargo_id, hazard_class, un_number, packing_group,
             proper_shipping_name, emergency_contact, emergency_phone,
             special_instructions, created_at, updated_at
      FROM hazardous_material_detail
      WHERE cargo_id = $1
    `;
        return await this.databaseService.queryOne<HazardousMaterialDetailEntity>(
            query,
            [cargoId],
        );
    }

    async findByHazardClass(
        hazardClass: string,
    ): Promise<HazardousMaterialDetailEntity[]> {
        const query = `
      SELECT id, cargo_id, hazard_class, un_number, packing_group,
             proper_shipping_name, emergency_contact, emergency_phone,
             special_instructions, created_at, updated_at
      FROM hazardous_material_detail
      WHERE hazard_class = $1
      ORDER BY created_at DESC
    `;
        return await this.databaseService.query<HazardousMaterialDetailEntity>(
            query,
            [hazardClass],
        );
    }
}
