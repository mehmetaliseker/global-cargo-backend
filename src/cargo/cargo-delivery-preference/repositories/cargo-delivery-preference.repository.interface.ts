export interface CargoDeliveryPreferenceEntity {
  id: number;
  cargo_id: number;
  delivery_option_id: number;
  preference_order: number;
  created_at: Date;
}

export interface ICargoDeliveryPreferenceRepository {
  findAll(): Promise<CargoDeliveryPreferenceEntity[]>;
  findById(id: number): Promise<CargoDeliveryPreferenceEntity | null>;
  findByCargoId(cargoId: number): Promise<CargoDeliveryPreferenceEntity[]>;
  findByDeliveryOptionId(deliveryOptionId: number): Promise<CargoDeliveryPreferenceEntity[]>;
}

