import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { EmployeeRoleService } from '../services/employee-role.service';
import {
  EmployeeRoleResponseDto,
  EmployeeRoleWithDetailsResponseDto,
} from '../dto/employee-role.dto';

@Controller('rbac/employee-roles')
export class EmployeeRoleController {
  constructor(private readonly employeeRoleService: EmployeeRoleService) {}

  @Get()
  async findAll(): Promise<EmployeeRoleResponseDto[]> {
    return await this.employeeRoleService.findAll();
  }

  @Get('employee/:employeeId')
  async findByEmployeeId(
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ): Promise<EmployeeRoleResponseDto[]> {
    return await this.employeeRoleService.findByEmployeeId(employeeId);
  }

  @Get('employee/:employeeId/active')
  async findByEmployeeIdAndActive(
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ): Promise<EmployeeRoleResponseDto[]> {
    return await this.employeeRoleService.findByEmployeeIdAndActive(employeeId);
  }

  @Get('employee/:employeeId/details')
  async findByEmployeeIdWithDetails(
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ): Promise<EmployeeRoleWithDetailsResponseDto[]> {
    return await this.employeeRoleService.findByEmployeeIdWithDetails(employeeId);
  }

  @Get('role/:roleId')
  async findByRoleId(
    @Param('roleId', ParseIntPipe) roleId: number,
  ): Promise<EmployeeRoleResponseDto[]> {
    return await this.employeeRoleService.findByRoleId(roleId);
  }

  @Get('role/:roleId/details')
  async findByRoleIdWithDetails(
    @Param('roleId', ParseIntPipe) roleId: number,
  ): Promise<EmployeeRoleWithDetailsResponseDto[]> {
    return await this.employeeRoleService.findByRoleIdWithDetails(roleId);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<EmployeeRoleResponseDto> {
    return await this.employeeRoleService.findById(id);
  }
}

