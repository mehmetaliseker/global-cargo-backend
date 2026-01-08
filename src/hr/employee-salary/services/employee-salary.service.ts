import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { EmployeeSalaryRepository } from '../repositories/employee-salary.repository';
import {
  EmployeeSalaryResponseDto,
  CreateEmployeeSalaryDto,
  UpdateEmployeeSalaryDto,
} from '../dto/employee-salary.dto';
import { EmployeeSalaryEntity } from '../repositories/employee-salary.repository.interface';

@Injectable()
export class EmployeeSalaryService {
  constructor(
    private readonly employeeSalaryRepository: EmployeeSalaryRepository,
  ) {}

  private mapToDto(entity: EmployeeSalaryEntity): EmployeeSalaryResponseDto {
    return {
      id: entity.id,
      employeeId: entity.employee_id,
      baseSalary: parseFloat(entity.base_salary.toString()),
      bonusAmount: parseFloat(entity.bonus_amount.toString()),
      primAmount: parseFloat(entity.prim_amount.toString()),
      totalAmount: parseFloat(entity.total_amount.toString()),
      currencyId: entity.currency_id,
      periodStartDate: entity.period_start_date.toISOString(),
      periodEndDate: entity.period_end_date?.toISOString(),
      paymentDate: entity.payment_date?.toISOString(),
      status: entity.status,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<EmployeeSalaryResponseDto[]> {
    const entities = await this.employeeSalaryRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<EmployeeSalaryResponseDto> {
    const entity = await this.employeeSalaryRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Employee salary with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByEmployeeId(employeeId: number): Promise<EmployeeSalaryResponseDto[]> {
    const entities =
      await this.employeeSalaryRepository.findByEmployeeId(employeeId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByEmployeeIdAndDateRange(
    employeeId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<EmployeeSalaryResponseDto[]> {
    const entities =
      await this.employeeSalaryRepository.findByEmployeeIdAndDateRange(
        employeeId,
        startDate,
        endDate,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByStatus(status: string): Promise<EmployeeSalaryResponseDto[]> {
    const entities = await this.employeeSalaryRepository.findByStatus(status);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByPeriod(
    periodStartDate: Date,
    periodEndDate: Date,
  ): Promise<EmployeeSalaryResponseDto[]> {
    const entities = await this.employeeSalaryRepository.findByPeriod(
      periodStartDate,
      periodEndDate,
    );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async create(
    createDto: CreateEmployeeSalaryDto,
  ): Promise<EmployeeSalaryResponseDto> {
    const calculatedTotal =
      createDto.baseSalary + createDto.bonusAmount + createDto.primAmount;

    const tolerance = 0.01;
    if (Math.abs(calculatedTotal - createDto.totalAmount) > tolerance) {
      throw new BadRequestException(
        `Total amount (${createDto.totalAmount}) must equal the sum of base salary (${createDto.baseSalary}), bonus (${createDto.bonusAmount}), and prim (${createDto.primAmount})`,
      );
    }

    if (createDto.periodEndDate && createDto.periodStartDate) {
      const end = new Date(createDto.periodEndDate);
      const start = new Date(createDto.periodStartDate);
      if (end < start) {
        throw new BadRequestException(
          'Period end date cannot be before period start date',
        );
      }
    }

    const entity = await this.employeeSalaryRepository.create(
      createDto.employeeId,
      createDto.baseSalary,
      createDto.bonusAmount,
      createDto.primAmount,
      createDto.totalAmount,
      createDto.currencyId,
      new Date(createDto.periodStartDate),
      createDto.periodEndDate ? new Date(createDto.periodEndDate) : null,
      createDto.paymentDate ? new Date(createDto.paymentDate) : null,
      createDto.status,
    );

    return this.mapToDto(entity);
  }

  async update(
    id: number,
    updateDto: UpdateEmployeeSalaryDto,
  ): Promise<EmployeeSalaryResponseDto> {
    const existing = await this.employeeSalaryRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Employee salary with id ${id} not found`);
    }

    const calculatedTotal =
      updateDto.baseSalary + updateDto.bonusAmount + updateDto.primAmount;

    const tolerance = 0.01;
    if (Math.abs(calculatedTotal - updateDto.totalAmount) > tolerance) {
      throw new BadRequestException(
        `Total amount (${updateDto.totalAmount}) must equal the sum of base salary (${updateDto.baseSalary}), bonus (${updateDto.bonusAmount}), and prim (${updateDto.primAmount})`,
      );
    }

    const entity = await this.employeeSalaryRepository.update(
      id,
      updateDto.baseSalary,
      updateDto.bonusAmount,
      updateDto.primAmount,
      updateDto.totalAmount,
      updateDto.paymentDate ? new Date(updateDto.paymentDate) : null,
      updateDto.status,
    );

    return this.mapToDto(entity);
  }

  async delete(id: number): Promise<void> {
    const existing = await this.employeeSalaryRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Employee salary with id ${id} not found`);
    }

    await this.employeeSalaryRepository.softDelete(id);
  }
}

