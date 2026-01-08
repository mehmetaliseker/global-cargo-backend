export interface RouteEntity {
  id: number;
  uuid: string;
  origin_distribution_center_id: number;
  destination_distribution_center_id: number;
  shipment_type_id: number;
  route_code?: string;
  estimated_duration_hours?: number;
  distance_km?: number;
  is_alternative_route: boolean;
  main_route_id?: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface IRouteRepository {
  findAll(): Promise<RouteEntity[]>;
  findById(id: number): Promise<RouteEntity | null>;
  findByUuid(uuid: string): Promise<RouteEntity | null>;
  findByRouteCode(routeCode: string): Promise<RouteEntity | null>;
  findByOriginDistributionCenterId(originId: number): Promise<RouteEntity[]>;
  findByDestinationDistributionCenterId(destinationId: number): Promise<RouteEntity[]>;
  findByShipmentTypeId(shipmentTypeId: number): Promise<RouteEntity[]>;
  findActive(): Promise<RouteEntity[]>;
  findByMainRouteId(mainRouteId: number): Promise<RouteEntity[]>;
  findAlternativeRoutes(mainRouteId: number): Promise<RouteEntity[]>;
  create(
    originDistributionCenterId: number,
    destinationDistributionCenterId: number,
    shipmentTypeId: number,
    routeCode: string | null,
    estimatedDurationHours: number | null,
    distanceKm: number | null,
    isAlternativeRoute: boolean,
    mainRouteId: number | null,
  ): Promise<RouteEntity>;
  update(
    id: number,
    routeCode: string | null,
    estimatedDurationHours: number | null,
    distanceKm: number | null,
    isActive: boolean,
  ): Promise<RouteEntity>;
  softDelete(id: number): Promise<void>;
}

