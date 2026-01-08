export interface CustomerSupportRequestEntity {
  id: number;
  uuid: string;
  customer_id: number;
  cargo_id?: number;
  request_type: string;
  subject?: string;
  description: string;
  priority: string;
  status: string;
  assigned_to?: number;
  requested_date: Date;
  resolved_date?: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface ICustomerSupportRequestRepository {
  findAll(): Promise<CustomerSupportRequestEntity[]>;
  findById(id: number): Promise<CustomerSupportRequestEntity | null>;
  findByUuid(uuid: string): Promise<CustomerSupportRequestEntity | null>;
  findByCustomerId(customerId: number): Promise<CustomerSupportRequestEntity[]>;
  findByCargoId(cargoId: number): Promise<CustomerSupportRequestEntity[]>;
  findByStatus(status: string): Promise<CustomerSupportRequestEntity[]>;
  findByPriority(priority: string): Promise<CustomerSupportRequestEntity[]>;
  findByAssignedTo(employeeId: number): Promise<CustomerSupportRequestEntity[]>;
  findByCustomerIdAndStatus(
    customerId: number,
    status: string,
  ): Promise<CustomerSupportRequestEntity[]>;
  create(
    customerId: number,
    cargoId: number | null,
    requestType: string,
    subject: string | null,
    description: string,
    priority: string,
    status: string,
    assignedTo: number | null,
  ): Promise<CustomerSupportRequestEntity>;
  update(
    id: number,
    requestType: string | null,
    subject: string | null,
    description: string | null,
    priority: string | null,
    status: string | null,
    assignedTo: number | null,
    resolvedDate: Date | null,
  ): Promise<CustomerSupportRequestEntity>;
  softDelete(id: number): Promise<void>;
}

