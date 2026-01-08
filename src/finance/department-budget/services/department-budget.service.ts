import { Injectable, NotFoundException } from '@nestjs/common';
import { DepartmentBudgetRepository } from '../repositories/department-budget.repository';
import { DepartmentBudgetResponseDto } from '../dto/department-budget.dto';
import { DepartmentBudgetEntity } from '../repositories/department-budget.repository.interface';

@Injectable()
export class DepartmentBudgetService {
    constructor(
        private readonly departmentBudgetRepository: DepartmentBudgetRepository,
    ) { }

    private mapToDto(entity: DepartmentBudgetEntity): DepartmentBudgetResponseDto {
        return {
            id: entity.id,
            uuid: entity.uuid,
            departmentName: entity.department_name,
            budgetYear: entity.budget_year,
            budgetAmount: parseFloat(entity.budget_amount.toString()),
            spentAmount: parseFloat(entity.spent_amount.toString()),
            availableAmount: parseFloat(entity.available_amount.toString()),
            budgetCategory: entity.budget_category ?? undefined,
            currencyId: entity.currency_id,
            isActive: entity.is_active,
            createdAt: entity.created_at.toISOString(),
            updatedAt: entity.updated_at.toISOString(),
        };
    }

    async findAll(): Promise<DepartmentBudgetResponseDto[]> {
        const entities = await this.departmentBudgetRepository.findAll();
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findById(id: number): Promise<DepartmentBudgetResponseDto> {
        const entity = await this.departmentBudgetRepository.findById(id);
        if (!entity) {
            throw new NotFoundException(`Department budget with id ${id} not found`);
        }
        return this.mapToDto(entity);
    }

    async findByUuid(uuid: string): Promise<DepartmentBudgetResponseDto> {
        const entity = await this.departmentBudgetRepository.findByUuid(uuid);
        if (!entity) {
            throw new NotFoundException(`Department budget with uuid ${uuid} not found`);
        }
        return this.mapToDto(entity);
    }

    async findByDepartmentName(departmentName: string): Promise<DepartmentBudgetResponseDto[]> {
        const entities = await this.departmentBudgetRepository.findByDepartmentName(departmentName);
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findByDepartmentNameAndYear(departmentName: string, budgetYear: number): Promise<DepartmentBudgetResponseDto[]> {
        const entities = await this.departmentBudgetRepository.findByDepartmentNameAndYear(departmentName, budgetYear);
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findByBudgetYear(budgetYear: number): Promise<DepartmentBudgetResponseDto[]> {
        const entities = await this.departmentBudgetRepository.findByBudgetYear(budgetYear);
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findByBudgetCategory(budgetCategory: string): Promise<DepartmentBudgetResponseDto[]> {
        const entities = await this.departmentBudgetRepository.findByBudgetCategory(budgetCategory);
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findActive(): Promise<DepartmentBudgetResponseDto[]> {
        const entities = await this.departmentBudgetRepository.findActive();
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findActiveByYear(budgetYear: number): Promise<DepartmentBudgetResponseDto[]> {
        const entities = await this.departmentBudgetRepository.findActiveByYear(budgetYear);
        return entities.map((entity) => this.mapToDto(entity));
    }
}
