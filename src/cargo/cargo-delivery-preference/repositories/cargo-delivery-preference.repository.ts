import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  CargoDeliveryPreferenceEntity,
  ICargoDeliveryPreferenceRepository,
} from './cargo-delivery-preference.repository.interface';

@Injectable()
export class CargoDeliveryPreferenceRepository
  implements ICargoDeliveryPreferenceRepository
{
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<CargoDeliveryPreferenceEntity[]> {
    const query = `
      SELECT id, cargo_id, delivery_option_id, preference_order, created_at
      FROM cargo_delivery_preference
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CargoDeliveryPreferenceEntity>(
      query,
    );
  }

  async findById(
    id: number,
  ): Promise<CargoDeliveryPreferenceEntity | null> {
    const query = `
      SELECT id, cargo_id, delivery_option_id, preference_order, created_at
      FROM cargo_delivery_preference
      WHERE id = $1
    `;
    return await this.databaseService.queryOne<CargoDeliveryPreferenceEntity>(
      query,
      [id],
    );
  }

  async findByCargoId(
    cargoId: number,
  ): Promise<CargoDeliveryPreferenceEntity[]> {
    const query = `
      SELECT id, cargo_id, delivery_option_id, preference_order, created_at
      FROM cargo_delivery_preference
      WHERE cargo_id = $1
      ORDER BY preference_order ASC
    `;
    return await this.databaseService.query<CargoDeliveryPreferenceEntity>(
      query,
      [cargoId],
    );
  }

  async findByDeliveryOptionId(
    deliveryOptionId: number,
  ): Promise<CargoDeliveryPreferenceEntity[]> {
    const query = `
      SELECT id, cargo_id, delivery_option_id, preference_order, created_at
      FROM cargo_delivery_preference
      WHERE delivery_option_id = $1
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CargoDeliveryPreferenceEntity>(
      query,
      [deliveryOptionId],
    );
  }
}

