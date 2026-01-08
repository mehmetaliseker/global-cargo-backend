import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { DepartmentBudgetService } from '../services/department-budget.service';
import { DepartmentBudgetResponseDto } from '../dto/department-budget.dto';

@Controller('finance/department-budgets')
export class DepartmentBudgetController {
    constructor(
        private readonly departmentBudgetService: DepartmentBudgetService,
    ) { }

    @Get()
    async findAll(): Promise<DepartmentBudgetResponseDto[]> {
        return await this.departmentBudgetService.findAll();
    }

    @Get('active')
    async findActive(): Promise<DepartmentBudgetResponseDto[]> {
        return await this.departmentBudgetService.findActive();
    }

    @Get('department/:departmentName')
    async findByDepartmentName(
        @Param('departmentName') departmentName: string,
    ): Promise<DepartmentBudgetResponseDto[]> {
        return await this.departmentBudgetService.findByDepartmentName(departmentName);
    }

    @Get('department/:departmentName/year/:budgetYear')
    async findByDepartmentNameAndYear(
        @Param('departmentName') departmentName: string,
        @Param('budgetYear', ParseIntPipe) budgetYear: number,
    ): Promise<DepartmentBudgetResponseDto[]> {
        return await this.departmentBudgetService.findByDepartmentNameAndYear(departmentName, budgetYear);
    }

    @Get('year/:budgetYear')
    async findByBudgetYear(
        @Param('budgetYear', ParseIntPipe) budgetYear: number,
    ): Promise<DepartmentBudgetResponseDto[]> {
        return await this.departmentBudgetService.findByBudgetYear(budgetYear);
    }

    @Get('year/:budgetYear/active')
    async findActiveByYear(
        @Param('budgetYear', ParseIntPipe) budgetYear: number,
    ): Promise<DepartmentBudgetResponseDto[]> {
        return await this.departmentBudgetService.findActiveByYear(budgetYear);
    }

    @Get('category/:budgetCategory')
    async findByBudgetCategory(
        @Param('budgetCategory') budgetCategory: string,
    ): Promise<DepartmentBudgetResponseDto[]> {
        return await this.departmentBudgetService.findByBudgetCategory(budgetCategory);
    }

    @Get('uuid/:uuid')
    async findByUuid(
        @Param('uuid') uuid: string,
    ): Promise<DepartmentBudgetResponseDto> {
        return await this.departmentBudgetService.findByUuid(uuid);
    }

    @Get(':id')
    async findById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<DepartmentBudgetResponseDto> {
        return await this.departmentBudgetService.findById(id);
    }
}
