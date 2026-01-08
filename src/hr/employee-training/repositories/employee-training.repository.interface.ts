export interface EmployeeTrainingEntity {
  id: number;
  employee_id: number;
  training_level: string;
  competency_criteria?: string;
  training_type?: string;
  completion_date?: Date;
  certificate_number?: string;
  certificate_file_reference?: string;
  is_certified: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface IEmployeeTrainingRepository {
  findAll(): Promise<EmployeeTrainingEntity[]>;
  findById(id: number): Promise<EmployeeTrainingEntity | null>;
  findByEmployeeId(employeeId: number): Promise<EmployeeTrainingEntity[]>;
  findByTrainingLevel(trainingLevel: string): Promise<EmployeeTrainingEntity[]>;
  findByTrainingType(trainingType: string): Promise<EmployeeTrainingEntity[]>;
  findByCertified(isCertified: boolean): Promise<EmployeeTrainingEntity[]>;
  findByEmployeeIdAndCertified(
    employeeId: number,
    isCertified: boolean,
  ): Promise<EmployeeTrainingEntity[]>;
  create(
    employeeId: number,
    trainingLevel: string,
    competencyCriteria: string | null,
    trainingType: string | null,
    completionDate: Date | null,
    certificateNumber: string | null,
    certificateFileReference: string | null,
    isCertified: boolean,
  ): Promise<EmployeeTrainingEntity>;
  update(
    id: number,
    trainingLevel: string,
    competencyCriteria: string | null,
    trainingType: string | null,
    completionDate: Date | null,
    certificateNumber: string | null,
    certificateFileReference: string | null,
    isCertified: boolean,
  ): Promise<EmployeeTrainingEntity>;
  softDelete(id: number): Promise<void>;
}

