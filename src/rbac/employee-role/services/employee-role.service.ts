import { Injectable, NotFoundException } from '@nestjs/common';
import { EmployeeRoleRepository } from '../repositories/employee-role.repository';
import {
  EmployeeRoleResponseDto,
  EmployeeRoleWithDetailsResponseDto,
} from '../dto/employee-role.dto';
import { EmployeeRoleEntity } from '../repositories/employee-role.repository.interface';
import { RoleRepository } from '../../role/repositories/role.repository';
import { EmployeeRepository } from '../../../actor/employee/repositories/employee.repository';

@Injectable()
export class EmployeeRoleService {
  constructor(
    private readonly employeeRoleRepository: EmployeeRoleRepository,
    private readonly roleRepository: RoleRepository,
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  private mapToDto(entity: EmployeeRoleEntity): EmployeeRoleResponseDto {
    return {
      id: entity.id,
      employeeId: entity.employee_id,
      roleId: entity.role_id,
      assignedAt: entity.assigned_at.toISOString(),
      assignedBy: entity.assigned_by,
      isActive: entity.is_active,
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<EmployeeRoleResponseDto[]> {
    const entities = await this.employeeRoleRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<EmployeeRoleResponseDto> {
    const entity = await this.employeeRoleRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Employee role with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByEmployeeId(employeeId: number): Promise<EmployeeRoleResponseDto[]> {
    const entities =
      await this.employeeRoleRepository.findByEmployeeId(employeeId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByRoleId(roleId: number): Promise<EmployeeRoleResponseDto[]> {
    const entities = await this.employeeRoleRepository.findByRoleId(roleId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByEmployeeIdAndActive(
    employeeId: number,
  ): Promise<EmployeeRoleResponseDto[]> {
    const entities =
      await this.employeeRoleRepository.findByEmployeeIdAndActive(employeeId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByEmployeeIdWithDetails(
    employeeId: number,
  ): Promise<EmployeeRoleWithDetailsResponseDto[]> {
    const employeeRoles =
      await this.employeeRoleRepository.findByEmployeeId(employeeId);
    const employee = await this.employeeRepository.findById(employeeId);
    if (!employee) {
      throw new NotFoundException(`Employee with id ${employeeId} not found`);
    }

    const result: EmployeeRoleWithDetailsResponseDto[] = [];

    for (const er of employeeRoles) {
      const role = await this.roleRepository.findById(er.role_id);
      if (role) {
        result.push({
          id: er.id,
          employeeId: er.employee_id,
          employeeNumber: employee.employee_number,
          employeeFirstName: employee.first_name,
          employeeLastName: employee.last_name,
          roleId: er.role_id,
          roleCode: role.code,
          roleName: role.name,
          assignedAt: er.assigned_at.toISOString(),
          assignedBy: er.assigned_by,
          isActive: er.is_active,
          deletedAt: er.deleted_at?.toISOString(),
        });
      }
    }

    return result;
  }

  async findByRoleIdWithDetails(
    roleId: number,
  ): Promise<EmployeeRoleWithDetailsResponseDto[]> {
    const employeeRoles =
      await this.employeeRoleRepository.findByRoleId(roleId);
    const role = await this.roleRepository.findById(roleId);
    if (!role) {
      throw new NotFoundException(`Role with id ${roleId} not found`);
    }

    const result: EmployeeRoleWithDetailsResponseDto[] = [];

    for (const er of employeeRoles) {
      const employee = await this.employeeRepository.findById(er.employee_id);
      if (employee) {
        result.push({
          id: er.id,
          employeeId: er.employee_id,
          employeeNumber: employee.employee_number,
          employeeFirstName: employee.first_name,
          employeeLastName: employee.last_name,
          roleId: er.role_id,
          roleCode: role.code,
          roleName: role.name,
          assignedAt: er.assigned_at.toISOString(),
          assignedBy: er.assigned_by,
          isActive: er.is_active,
          deletedAt: er.deleted_at?.toISOString(),
        });
      }
    }

    return result;
  }
}

