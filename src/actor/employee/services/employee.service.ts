import { Injectable, NotFoundException } from '@nestjs/common';
import { EmployeeRepository } from '../repositories/employee.repository';
import { EmployeeResponseDto } from '../dto/employee.dto';
import { EmployeeEntity } from '../repositories/employee.repository.interface';

@Injectable()
export class EmployeeService {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  private mapToDto(entity: EmployeeEntity): EmployeeResponseDto {
    return {
      id: entity.id,
      uuid: entity.uuid,
      actorId: entity.actor_id,
      employeeNumber: entity.employee_number,
      firstName: entity.first_name,
      lastName: entity.last_name,
      hireDate: entity.hire_date.toISOString().split('T')[0],
      department: entity.department,
      position: entity.position,
      countryId: entity.country_id,
      isActive: entity.is_active,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<EmployeeResponseDto[]> {
    const entities = await this.employeeRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<EmployeeResponseDto> {
    const entity = await this.employeeRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByUuid(uuid: string): Promise<EmployeeResponseDto> {
    const entity = await this.employeeRepository.findByUuid(uuid);
    if (!entity) {
      throw new NotFoundException(`Employee with uuid ${uuid} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByActorId(actorId: number): Promise<EmployeeResponseDto> {
    const entity = await this.employeeRepository.findByActorId(actorId);
    if (!entity) {
      throw new NotFoundException(
        `Employee with actor id ${actorId} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByEmployeeNumber(
    employeeNumber: string,
  ): Promise<EmployeeResponseDto> {
    const entity =
      await this.employeeRepository.findByEmployeeNumber(employeeNumber);
    if (!entity) {
      throw new NotFoundException(
        `Employee with employee number ${employeeNumber} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByCountryId(countryId: number): Promise<EmployeeResponseDto[]> {
    const entities = await this.employeeRepository.findByCountryId(countryId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findActive(): Promise<EmployeeResponseDto[]> {
    const entities = await this.employeeRepository.findActive();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByCountryIdAndActive(
    countryId: number,
  ): Promise<EmployeeResponseDto[]> {
    const entities =
      await this.employeeRepository.findByCountryIdAndActive(countryId);
    return entities.map((entity) => this.mapToDto(entity));
  }
}

