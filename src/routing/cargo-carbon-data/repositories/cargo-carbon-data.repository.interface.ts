export interface CargoCarbonDataEntity {
  id: number;
  cargo_id: number;
  carbon_footprint_value: number;
  calculation_method?: string;
  shipment_type_id?: number;
  distance_km?: number;
  calculation_timestamp: Date;
  created_at: Date;
}

export interface ICargoCarbonDataRepository {
  findAll(): Promise<CargoCarbonDataEntity[]>;
  findById(id: number): Promise<CargoCarbonDataEntity | null>;
  findByCargoId(cargoId: number): Promise<CargoCarbonDataEntity | null>;
  findByShipmentTypeId(shipmentTypeId: number): Promise<CargoCarbonDataEntity[]>;
  create(
    cargoId: number,
    carbonFootprintValue: number,
    calculationMethod: string | null,
    shipmentTypeId: number | null,
    distanceKm: number | null,
  ): Promise<CargoCarbonDataEntity>;
  update(
    id: number,
    carbonFootprintValue: number,
    calculationMethod: string | null,
    shipmentTypeId: number | null,
    distanceKm: number | null,
  ): Promise<CargoCarbonDataEntity>;
}

