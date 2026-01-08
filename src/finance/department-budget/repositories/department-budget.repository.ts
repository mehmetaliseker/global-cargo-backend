import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
    DepartmentBudgetEntity,
    IDepartmentBudgetRepository,
} from './department-budget.repository.interface';

@Injectable()
export class DepartmentBudgetRepository implements IDepartmentBudgetRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async findAll(): Promise<DepartmentBudgetEntity[]> {
        const query = `
      SELECT id, uuid, department_name, budget_year, budget_amount,
             spent_amount, available_amount, budget_category, currency_id,
             is_active, created_at, updated_at, deleted_at
      FROM department_budget
      WHERE deleted_at IS NULL
      ORDER BY budget_year DESC, department_name ASC
    `;
        return await this.databaseService.query<DepartmentBudgetEntity>(query);
    }

    async findById(id: number): Promise<DepartmentBudgetEntity | null> {
        const query = `
      SELECT id, uuid, department_name, budget_year, budget_amount,
             spent_amount, available_amount, budget_category, currency_id,
             is_active, created_at, updated_at, deleted_at
      FROM department_budget
      WHERE id = $1 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<DepartmentBudgetEntity>(query, [id]);
    }

    async findByUuid(uuid: string): Promise<DepartmentBudgetEntity | null> {
        const query = `
      SELECT id, uuid, department_name, budget_year, budget_amount,
             spent_amount, available_amount, budget_category, currency_id,
             is_active, created_at, updated_at, deleted_at
      FROM department_budget
      WHERE uuid = $1 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<DepartmentBudgetEntity>(query, [uuid]);
    }

    async findByDepartmentName(departmentName: string): Promise<DepartmentBudgetEntity[]> {
        const query = `
      SELECT id, uuid, department_name, budget_year, budget_amount,
             spent_amount, available_amount, budget_category, currency_id,
             is_active, created_at, updated_at, deleted_at
      FROM department_budget
      WHERE department_name = $1 AND deleted_at IS NULL
      ORDER BY budget_year DESC
    `;
        return await this.databaseService.query<DepartmentBudgetEntity>(query, [departmentName]);
    }

    async findByDepartmentNameAndYear(departmentName: string, budgetYear: number): Promise<DepartmentBudgetEntity[]> {
        const query = `
      SELECT id, uuid, department_name, budget_year, budget_amount,
             spent_amount, available_amount, budget_category, currency_id,
             is_active, created_at, updated_at, deleted_at
      FROM department_budget
      WHERE department_name = $1 AND budget_year = $2 AND deleted_at IS NULL
      ORDER BY budget_category ASC
    `;
        return await this.databaseService.query<DepartmentBudgetEntity>(query, [departmentName, budgetYear]);
    }

    async findByBudgetYear(budgetYear: number): Promise<DepartmentBudgetEntity[]> {
        const query = `
      SELECT id, uuid, department_name, budget_year, budget_amount,
             spent_amount, available_amount, budget_category, currency_id,
             is_active, created_at, updated_at, deleted_at
      FROM department_budget
      WHERE budget_year = $1 AND deleted_at IS NULL
      ORDER BY department_name ASC, budget_category ASC
    `;
        return await this.databaseService.query<DepartmentBudgetEntity>(query, [budgetYear]);
    }

    async findByBudgetCategory(budgetCategory: string): Promise<DepartmentBudgetEntity[]> {
        const query = `
      SELECT id, uuid, department_name, budget_year, budget_amount,
             spent_amount, available_amount, budget_category, currency_id,
             is_active, created_at, updated_at, deleted_at
      FROM department_budget
      WHERE budget_category = $1 AND deleted_at IS NULL
      ORDER BY budget_year DESC, department_name ASC
    `;
        return await this.databaseService.query<DepartmentBudgetEntity>(query, [budgetCategory]);
    }

    async findActive(): Promise<DepartmentBudgetEntity[]> {
        const query = `
      SELECT id, uuid, department_name, budget_year, budget_amount,
             spent_amount, available_amount, budget_category, currency_id,
             is_active, created_at, updated_at, deleted_at
      FROM department_budget
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY budget_year DESC, department_name ASC
    `;
        return await this.databaseService.query<DepartmentBudgetEntity>(query);
    }

    async findActiveByYear(budgetYear: number): Promise<DepartmentBudgetEntity[]> {
        const query = `
      SELECT id, uuid, department_name, budget_year, budget_amount,
             spent_amount, available_amount, budget_category, currency_id,
             is_active, created_at, updated_at, deleted_at
      FROM department_budget
      WHERE is_active = true AND budget_year = $1 AND deleted_at IS NULL
      ORDER BY department_name ASC, budget_category ASC
    `;
        return await this.databaseService.query<DepartmentBudgetEntity>(query, [budgetYear]);
    }
}
