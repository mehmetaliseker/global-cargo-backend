export interface CargoEntity {
  id: number;
  uuid: string;
  tracking_number: string;
  delivery_number?: string;
  customer_id: number;
  origin_branch_id?: number;
  destination_branch_id?: number;
  origin_country_id: number;
  destination_country_id: number;
  origin_date: Date;
  estimated_delivery_date?: Date;
  actual_delivery_date?: Date;
  cargo_type_id: number;
  shipment_type_id: number;
  weight_kg: number;
  length_cm?: number;
  width_cm?: number;
  height_cm?: number;
  volumetric_weight_kg?: number;
  value_declaration?: number;
  currency_id: number;
  current_state_id?: number;
  undelivered_cancel_threshold_hours: number;
  is_auto_cancelled: boolean;
  auto_cancel_date?: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface ICargoRepository {
  findAll(): Promise<CargoEntity[]>;
  findById(id: number): Promise<CargoEntity | null>;
  findByUuid(uuid: string): Promise<CargoEntity | null>;
  findByTrackingNumber(trackingNumber: string): Promise<CargoEntity | null>;
  findByDeliveryNumber(deliveryNumber: string): Promise<CargoEntity | null>;
  findByCustomerId(customerId: number): Promise<CargoEntity[]>;
  findByOriginCountryId(originCountryId: number): Promise<CargoEntity[]>;
  findByDestinationCountryId(destinationCountryId: number): Promise<CargoEntity[]>;
  findByCurrentStateId(stateId: number): Promise<CargoEntity[]>;
  findByEstimatedDeliveryDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<CargoEntity[]>;
}

