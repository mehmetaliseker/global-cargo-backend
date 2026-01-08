import { Module } from '@nestjs/common';
import { DepartmentBudgetModule } from './department-budget/department-budget.module';

@Module({
    imports: [
        DepartmentBudgetModule,
    ],
    exports: [
        DepartmentBudgetModule,
    ],
})
export class FinanceModule { }
