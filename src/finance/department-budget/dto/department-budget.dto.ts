import {
    IsNumber,
    IsString,
    IsBoolean,
    IsOptional,
    IsUUID,
} from 'class-validator';

export class DepartmentBudgetResponseDto {
    @IsNumber()
    id: number;

    @IsUUID()
    uuid: string;

    @IsString()
    departmentName: string;

    @IsNumber()
    budgetYear: number;

    @IsNumber()
    budgetAmount: number;

    @IsNumber()
    spentAmount: number;

    @IsNumber()
    availableAmount: number;

    @IsOptional()
    @IsString()
    budgetCategory?: string;

    @IsNumber()
    currencyId: number;

    @IsBoolean()
    isActive: boolean;

    @IsString()
    createdAt: string;

    @IsString()
    updatedAt: string;
}
