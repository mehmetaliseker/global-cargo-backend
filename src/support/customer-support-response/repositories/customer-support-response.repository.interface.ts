export interface CustomerSupportResponseEntity {
  id: number;
  support_request_id: number;
  employee_id?: number;
  response_content: string;
  is_resolution: boolean;
  response_date: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface ICustomerSupportResponseRepository {
  findAll(): Promise<CustomerSupportResponseEntity[]>;
  findById(id: number): Promise<CustomerSupportResponseEntity | null>;
  findBySupportRequestId(
    supportRequestId: number,
  ): Promise<CustomerSupportResponseEntity[]>;
  findByEmployeeId(
    employeeId: number,
  ): Promise<CustomerSupportResponseEntity[]>;
  findResolutions(
    supportRequestId: number,
  ): Promise<CustomerSupportResponseEntity[]>;
  create(
    supportRequestId: number,
    employeeId: number | null,
    responseContent: string,
    isResolution: boolean,
  ): Promise<CustomerSupportResponseEntity>;
  softDelete(id: number): Promise<void>;
}

