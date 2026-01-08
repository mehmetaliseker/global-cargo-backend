export interface DepartmentBudgetEntity {
    id: number;
    uuid: string;
    department_name: string;
    budget_year: number;
    budget_amount: number;
    spent_amount: number;
    available_amount: number;
    budget_category?: string;
    currency_id: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}

export interface IDepartmentBudgetRepository {
    findAll(): Promise<DepartmentBudgetEntity[]>;
    findById(id: number): Promise<DepartmentBudgetEntity | null>;
    findByUuid(uuid: string): Promise<DepartmentBudgetEntity | null>;
    findByDepartmentName(departmentName: string): Promise<DepartmentBudgetEntity[]>;
    findByDepartmentNameAndYear(departmentName: string, budgetYear: number): Promise<DepartmentBudgetEntity[]>;
    findByBudgetYear(budgetYear: number): Promise<DepartmentBudgetEntity[]>;
    findByBudgetCategory(budgetCategory: string): Promise<DepartmentBudgetEntity[]>;
    findActive(): Promise<DepartmentBudgetEntity[]>;
    findActiveByYear(budgetYear: number): Promise<DepartmentBudgetEntity[]>;
}
