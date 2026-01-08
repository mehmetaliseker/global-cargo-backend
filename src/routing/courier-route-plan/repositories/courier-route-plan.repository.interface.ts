export interface CourierRoutePlanEntity {
  id: number;
  employee_id: number;
  route_id: number;
  plan_date: Date;
  status: string;
  start_time?: Date;
  end_time?: Date;
  total_cargo_count: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface ICourierRoutePlanRepository {
  findAll(): Promise<CourierRoutePlanEntity[]>;
  findById(id: number): Promise<CourierRoutePlanEntity | null>;
  findByEmployeeId(employeeId: number): Promise<CourierRoutePlanEntity[]>;
  findByRouteId(routeId: number): Promise<CourierRoutePlanEntity[]>;
  findByPlanDate(planDate: Date): Promise<CourierRoutePlanEntity[]>;
  findByStatus(status: string): Promise<CourierRoutePlanEntity[]>;
  findByEmployeeIdAndDate(
    employeeId: number,
    planDate: Date,
  ): Promise<CourierRoutePlanEntity[]>;
  create(
    employeeId: number,
    routeId: number,
    planDate: Date,
    status: string,
    startTime: Date | null,
    endTime: Date | null,
    totalCargoCount: number,
  ): Promise<CourierRoutePlanEntity>;
  update(
    id: number,
    status: string,
    startTime: Date | null,
    endTime: Date | null,
    totalCargoCount: number,
  ): Promise<CourierRoutePlanEntity>;
  softDelete(id: number): Promise<void>;
}

