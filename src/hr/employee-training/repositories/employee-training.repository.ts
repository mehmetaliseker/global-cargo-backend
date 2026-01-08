import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { DatabaseService } from '../../../database/database.service';
import {
  EmployeeTrainingEntity,
  IEmployeeTrainingRepository,
} from './employee-training.repository.interface';

@Injectable()
export class EmployeeTrainingRepository
  implements IEmployeeTrainingRepository
{
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<EmployeeTrainingEntity[]> {
    const query = `
      SELECT id, employee_id, training_level, competency_criteria, training_type,
             completion_date, certificate_number, certificate_file_reference, is_certified,
             created_at, updated_at, deleted_at
      FROM employee_training
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<EmployeeTrainingEntity>(query);
  }

  async findById(id: number): Promise<EmployeeTrainingEntity | null> {
    const query = `
      SELECT id, employee_id, training_level, competency_criteria, training_type,
             completion_date, certificate_number, certificate_file_reference, is_certified,
             created_at, updated_at, deleted_at
      FROM employee_training
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<EmployeeTrainingEntity>(query, [
      id,
    ]);
  }

  async findByEmployeeId(employeeId: number): Promise<EmployeeTrainingEntity[]> {
    const query = `
      SELECT id, employee_id, training_level, competency_criteria, training_type,
             completion_date, certificate_number, certificate_file_reference, is_certified,
             created_at, updated_at, deleted_at
      FROM employee_training
      WHERE employee_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<EmployeeTrainingEntity>(query, [
      employeeId,
    ]);
  }

  async findByTrainingLevel(trainingLevel: string): Promise<EmployeeTrainingEntity[]> {
    const query = `
      SELECT id, employee_id, training_level, competency_criteria, training_type,
             completion_date, certificate_number, certificate_file_reference, is_certified,
             created_at, updated_at, deleted_at
      FROM employee_training
      WHERE training_level = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<EmployeeTrainingEntity>(query, [
      trainingLevel,
    ]);
  }

  async findByTrainingType(trainingType: string): Promise<EmployeeTrainingEntity[]> {
    const query = `
      SELECT id, employee_id, training_level, competency_criteria, training_type,
             completion_date, certificate_number, certificate_file_reference, is_certified,
             created_at, updated_at, deleted_at
      FROM employee_training
      WHERE training_type = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<EmployeeTrainingEntity>(query, [
      trainingType,
    ]);
  }

  async findByCertified(isCertified: boolean): Promise<EmployeeTrainingEntity[]> {
    const query = `
      SELECT id, employee_id, training_level, competency_criteria, training_type,
             completion_date, certificate_number, certificate_file_reference, is_certified,
             created_at, updated_at, deleted_at
      FROM employee_training
      WHERE is_certified = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<EmployeeTrainingEntity>(query, [
      isCertified,
    ]);
  }

  async findByEmployeeIdAndCertified(
    employeeId: number,
    isCertified: boolean,
  ): Promise<EmployeeTrainingEntity[]> {
    const query = `
      SELECT id, employee_id, training_level, competency_criteria, training_type,
             completion_date, certificate_number, certificate_file_reference, is_certified,
             created_at, updated_at, deleted_at
      FROM employee_training
      WHERE employee_id = $1 AND is_certified = $2 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<EmployeeTrainingEntity>(query, [
      employeeId,
      isCertified,
    ]);
  }

  async create(
    employeeId: number,
    trainingLevel: string,
    competencyCriteria: string | null,
    trainingType: string | null,
    completionDate: Date | null,
    certificateNumber: string | null,
    certificateFileReference: string | null,
    isCertified: boolean,
  ): Promise<EmployeeTrainingEntity> {
    return await this.databaseService.transaction(
      async (client: PoolClient): Promise<EmployeeTrainingEntity> => {
        const insertQuery = `
          INSERT INTO employee_training 
            (employee_id, training_level, competency_criteria, training_type,
             completion_date, certificate_number, certificate_file_reference, is_certified)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING id, employee_id, training_level, competency_criteria, training_type,
                    completion_date, certificate_number, certificate_file_reference, is_certified,
                    created_at, updated_at, deleted_at
        `;
        const result = await client.query<EmployeeTrainingEntity>(insertQuery, [
          employeeId,
          trainingLevel,
          competencyCriteria,
          trainingType,
          completionDate,
          certificateNumber,
          certificateFileReference,
          isCertified,
        ]);
        return result.rows[0];
      },
    );
  }

  async update(
    id: number,
    trainingLevel: string,
    competencyCriteria: string | null,
    trainingType: string | null,
    completionDate: Date | null,
    certificateNumber: string | null,
    certificateFileReference: string | null,
    isCertified: boolean,
  ): Promise<EmployeeTrainingEntity> {
    return await this.databaseService.transaction(
      async (client: PoolClient): Promise<EmployeeTrainingEntity> => {
        const updateQuery = `
          UPDATE employee_training
          SET training_level = $2,
              competency_criteria = $3,
              training_type = $4,
              completion_date = $5,
              certificate_number = $6,
              certificate_file_reference = $7,
              is_certified = $8,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $1 AND deleted_at IS NULL
          RETURNING id, employee_id, training_level, competency_criteria, training_type,
                    completion_date, certificate_number, certificate_file_reference, is_certified,
                    created_at, updated_at, deleted_at
        `;
        const result = await client.query<EmployeeTrainingEntity>(updateQuery, [
          id,
          trainingLevel,
          competencyCriteria,
          trainingType,
          completionDate,
          certificateNumber,
          certificateFileReference,
          isCertified,
        ]);
        if (result.rows.length === 0) {
          throw new Error(`Employee training with id ${id} not found`);
        }
        return result.rows[0];
      },
    );
  }

  async softDelete(id: number): Promise<void> {
    await this.databaseService.transaction(
      async (client: PoolClient): Promise<void> => {
        const deleteQuery = `
          UPDATE employee_training
          SET deleted_at = CURRENT_TIMESTAMP,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $1 AND deleted_at IS NULL
        `;
        const result = await client.query(deleteQuery, [id]);
        if (result.rowCount === 0) {
          throw new Error(`Employee training with id ${id} not found`);
        }
      },
    );
  }
}

