import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { CargoEntity, ICargoRepository } from './cargo.repository.interface';

@Injectable()
export class CargoRepository implements ICargoRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<CargoEntity[]> {
    const query = `
      SELECT id, uuid, tracking_number, delivery_number, customer_id, origin_branch_id, destination_branch_id,
             origin_country_id, destination_country_id, origin_date, estimated_delivery_date, actual_delivery_date,
             cargo_type_id, shipment_type_id, weight_kg, length_cm, width_cm, height_cm, volumetric_weight_kg,
             value_declaration, currency_id, current_state_id, undelivered_cancel_threshold_hours,
             is_auto_cancelled, auto_cancel_date, created_at, updated_at, deleted_at
      FROM cargo
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CargoEntity>(query);
  }

  async findById(id: number): Promise<CargoEntity | null> {
    const query = `
      SELECT id, uuid, tracking_number, delivery_number, customer_id, origin_branch_id, destination_branch_id,
             origin_country_id, destination_country_id, origin_date, estimated_delivery_date, actual_delivery_date,
             cargo_type_id, shipment_type_id, weight_kg, length_cm, width_cm, height_cm, volumetric_weight_kg,
             value_declaration, currency_id, current_state_id, undelivered_cancel_threshold_hours,
             is_auto_cancelled, auto_cancel_date, created_at, updated_at, deleted_at
      FROM cargo
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<CargoEntity>(query, [id]);
  }

  async findByUuid(uuid: string): Promise<CargoEntity | null> {
    const query = `
      SELECT id, uuid, tracking_number, delivery_number, customer_id, origin_branch_id, destination_branch_id,
             origin_country_id, destination_country_id, origin_date, estimated_delivery_date, actual_delivery_date,
             cargo_type_id, shipment_type_id, weight_kg, length_cm, width_cm, height_cm, volumetric_weight_kg,
             value_declaration, currency_id, current_state_id, undelivered_cancel_threshold_hours,
             is_auto_cancelled, auto_cancel_date, created_at, updated_at, deleted_at
      FROM cargo
      WHERE uuid = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<CargoEntity>(query, [uuid]);
  }

  async findByTrackingNumber(
    trackingNumber: string,
  ): Promise<CargoEntity | null> {
    const query = `
      SELECT id, uuid, tracking_number, delivery_number, customer_id, origin_branch_id, destination_branch_id,
             origin_country_id, destination_country_id, origin_date, estimated_delivery_date, actual_delivery_date,
             cargo_type_id, shipment_type_id, weight_kg, length_cm, width_cm, height_cm, volumetric_weight_kg,
             value_declaration, currency_id, current_state_id, undelivered_cancel_threshold_hours,
             is_auto_cancelled, auto_cancel_date, created_at, updated_at, deleted_at
      FROM cargo
      WHERE tracking_number = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<CargoEntity>(query, [
      trackingNumber,
    ]);
  }

  async findByDeliveryNumber(
    deliveryNumber: string,
  ): Promise<CargoEntity | null> {
    const query = `
      SELECT id, uuid, tracking_number, delivery_number, customer_id, origin_branch_id, destination_branch_id,
             origin_country_id, destination_country_id, origin_date, estimated_delivery_date, actual_delivery_date,
             cargo_type_id, shipment_type_id, weight_kg, length_cm, width_cm, height_cm, volumetric_weight_kg,
             value_declaration, currency_id, current_state_id, undelivered_cancel_threshold_hours,
             is_auto_cancelled, auto_cancel_date, created_at, updated_at, deleted_at
      FROM cargo
      WHERE delivery_number = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<CargoEntity>(query, [
      deliveryNumber,
    ]);
  }

  async findByCustomerId(customerId: number): Promise<CargoEntity[]> {
    const query = `
      SELECT id, uuid, tracking_number, delivery_number, customer_id, origin_branch_id, destination_branch_id,
             origin_country_id, destination_country_id, origin_date, estimated_delivery_date, actual_delivery_date,
             cargo_type_id, shipment_type_id, weight_kg, length_cm, width_cm, height_cm, volumetric_weight_kg,
             value_declaration, currency_id, current_state_id, undelivered_cancel_threshold_hours,
             is_auto_cancelled, auto_cancel_date, created_at, updated_at, deleted_at
      FROM cargo
      WHERE customer_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CargoEntity>(query, [customerId]);
  }

  async findByOriginCountryId(
    originCountryId: number,
  ): Promise<CargoEntity[]> {
    const query = `
      SELECT id, uuid, tracking_number, delivery_number, customer_id, origin_branch_id, destination_branch_id,
             origin_country_id, destination_country_id, origin_date, estimated_delivery_date, actual_delivery_date,
             cargo_type_id, shipment_type_id, weight_kg, length_cm, width_cm, height_cm, volumetric_weight_kg,
             value_declaration, currency_id, current_state_id, undelivered_cancel_threshold_hours,
             is_auto_cancelled, auto_cancel_date, created_at, updated_at, deleted_at
      FROM cargo
      WHERE origin_country_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CargoEntity>(query, [
      originCountryId,
    ]);
  }

  async findByDestinationCountryId(
    destinationCountryId: number,
  ): Promise<CargoEntity[]> {
    const query = `
      SELECT id, uuid, tracking_number, delivery_number, customer_id, origin_branch_id, destination_branch_id,
             origin_country_id, destination_country_id, origin_date, estimated_delivery_date, actual_delivery_date,
             cargo_type_id, shipment_type_id, weight_kg, length_cm, width_cm, height_cm, volumetric_weight_kg,
             value_declaration, currency_id, current_state_id, undelivered_cancel_threshold_hours,
             is_auto_cancelled, auto_cancel_date, created_at, updated_at, deleted_at
      FROM cargo
      WHERE destination_country_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CargoEntity>(query, [
      destinationCountryId,
    ]);
  }

  async findByCurrentStateId(stateId: number): Promise<CargoEntity[]> {
    const query = `
      SELECT id, uuid, tracking_number, delivery_number, customer_id, origin_branch_id, destination_branch_id,
             origin_country_id, destination_country_id, origin_date, estimated_delivery_date, actual_delivery_date,
             cargo_type_id, shipment_type_id, weight_kg, length_cm, width_cm, height_cm, volumetric_weight_kg,
             value_declaration, currency_id, current_state_id, undelivered_cancel_threshold_hours,
             is_auto_cancelled, auto_cancel_date, created_at, updated_at, deleted_at
      FROM cargo
      WHERE current_state_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CargoEntity>(query, [stateId]);
  }

  async findByEstimatedDeliveryDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<CargoEntity[]> {
    const query = `
      SELECT id, uuid, tracking_number, delivery_number, customer_id, origin_branch_id, destination_branch_id,
             origin_country_id, destination_country_id, origin_date, estimated_delivery_date, actual_delivery_date,
             cargo_type_id, shipment_type_id, weight_kg, length_cm, width_cm, height_cm, volumetric_weight_kg,
             value_declaration, currency_id, current_state_id, undelivered_cancel_threshold_hours,
             is_auto_cancelled, auto_cancel_date, created_at, updated_at, deleted_at
      FROM cargo
      WHERE estimated_delivery_date >= $1 AND estimated_delivery_date <= $2 AND deleted_at IS NULL
      ORDER BY estimated_delivery_date ASC
    `;
    return await this.databaseService.query<CargoEntity>(query, [
      startDate,
      endDate,
    ]);
  }
}

