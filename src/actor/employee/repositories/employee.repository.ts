import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  EmployeeEntity,
  IEmployeeRepository,
} from './employee.repository.interface';

@Injectable()
export class EmployeeRepository implements IEmployeeRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<EmployeeEntity[]> {
    const query = `
      SELECT id, uuid, actor_id, employee_number, first_name, last_name, hire_date, department, position, country_id, is_active, created_at, updated_at, deleted_at
      FROM employee
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<EmployeeEntity>(query);
  }

  async findById(id: number): Promise<EmployeeEntity | null> {
    const query = `
      SELECT id, uuid, actor_id, employee_number, first_name, last_name, hire_date, department, position, country_id, is_active, created_at, updated_at, deleted_at
      FROM employee
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<EmployeeEntity>(query, [id]);
  }

  async findByUuid(uuid: string): Promise<EmployeeEntity | null> {
    const query = `
      SELECT id, uuid, actor_id, employee_number, first_name, last_name, hire_date, department, position, country_id, is_active, created_at, updated_at, deleted_at
      FROM employee
      WHERE uuid = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<EmployeeEntity>(query, [uuid]);
  }

  async findByActorId(actorId: number): Promise<EmployeeEntity | null> {
    const query = `
      SELECT id, uuid, actor_id, employee_number, first_name, last_name, hire_date, department, position, country_id, is_active, created_at, updated_at, deleted_at
      FROM employee
      WHERE actor_id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<EmployeeEntity>(query, [
      actorId,
    ]);
  }

  async findByEmployeeNumber(
    employeeNumber: string,
  ): Promise<EmployeeEntity | null> {
    const query = `
      SELECT id, uuid, actor_id, employee_number, first_name, last_name, hire_date, department, position, country_id, is_active, created_at, updated_at, deleted_at
      FROM employee
      WHERE employee_number = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<EmployeeEntity>(query, [
      employeeNumber,
    ]);
  }

  async findByCountryId(countryId: number): Promise<EmployeeEntity[]> {
    const query = `
      SELECT id, uuid, actor_id, employee_number, first_name, last_name, hire_date, department, position, country_id, is_active, created_at, updated_at, deleted_at
      FROM employee
      WHERE country_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<EmployeeEntity>(query, [countryId]);
  }

  async findActive(): Promise<EmployeeEntity[]> {
    const query = `
      SELECT id, uuid, actor_id, employee_number, first_name, last_name, hire_date, department, position, country_id, is_active, created_at, updated_at, deleted_at
      FROM employee
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<EmployeeEntity>(query);
  }

  async findByCountryIdAndActive(
    countryId: number,
  ): Promise<EmployeeEntity[]> {
    const query = `
      SELECT id, uuid, actor_id, employee_number, first_name, last_name, hire_date, department, position, country_id, is_active, created_at, updated_at, deleted_at
      FROM employee
      WHERE country_id = $1 AND is_active = true AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<EmployeeEntity>(query, [countryId]);
  }
}

