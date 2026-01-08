import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { DepartmentBudgetRepository } from './repositories/department-budget.repository';
import { DepartmentBudgetService } from './services/department-budget.service';
import { DepartmentBudgetController } from './controllers/department-budget.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [DepartmentBudgetController],
    providers: [DepartmentBudgetRepository, DepartmentBudgetService],
    exports: [DepartmentBudgetService, DepartmentBudgetRepository],
})
export class DepartmentBudgetModule { }
