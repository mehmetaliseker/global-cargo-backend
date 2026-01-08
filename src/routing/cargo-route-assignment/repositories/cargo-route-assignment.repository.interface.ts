export interface CargoRouteAssignmentEntity {
  id: number;
  cargo_id: number;
  route_id: number;
  assigned_date: Date;
  assigned_by?: number;
  is_active: boolean;
  created_at: Date;
}

export interface ICargoRouteAssignmentRepository {
  findAll(): Promise<CargoRouteAssignmentEntity[]>;
  findById(id: number): Promise<CargoRouteAssignmentEntity | null>;
  findByCargoId(cargoId: number): Promise<CargoRouteAssignmentEntity | null>;
  findByCargoIdActive(cargoId: number): Promise<CargoRouteAssignmentEntity | null>;
  findByRouteId(routeId: number): Promise<CargoRouteAssignmentEntity[]>;
  findByRouteIdActive(routeId: number): Promise<CargoRouteAssignmentEntity[]>;
  findActive(): Promise<CargoRouteAssignmentEntity[]>;
  create(
    cargoId: number,
    routeId: number,
    assignedBy: number | null,
  ): Promise<CargoRouteAssignmentEntity>;
  deactivate(id: number): Promise<CargoRouteAssignmentEntity>;
}

