export interface EmployeeEntity {
  id: number;
  uuid: string;
  actor_id: number;
  employee_number: string;
  first_name: string;
  last_name: string;
  hire_date: Date;
  department?: string;
  position?: string;
  country_id?: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface IEmployeeRepository {
  findAll(): Promise<EmployeeEntity[]>;
  findById(id: number): Promise<EmployeeEntity | null>;
  findByUuid(uuid: string): Promise<EmployeeEntity | null>;
  findByActorId(actorId: number): Promise<EmployeeEntity | null>;
  findByEmployeeNumber(employeeNumber: string): Promise<EmployeeEntity | null>;
  findByCountryId(countryId: number): Promise<EmployeeEntity[]>;
  findActive(): Promise<EmployeeEntity[]>;
  findByCountryIdAndActive(countryId: number): Promise<EmployeeEntity[]>;
}

