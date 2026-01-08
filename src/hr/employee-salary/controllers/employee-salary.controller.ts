import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EmployeeSalaryService } from '../services/employee-salary.service';
import {
  EmployeeSalaryResponseDto,
  CreateEmployeeSalaryDto,
  UpdateEmployeeSalaryDto,
} from '../dto/employee-salary.dto';

@Controller('hr/salaries')
export class EmployeeSalaryController {
  constructor(
    private readonly employeeSalaryService: EmployeeSalaryService,
  ) {}

  @Get()
  async findAll(): Promise<EmployeeSalaryResponseDto[]> {
    return await this.employeeSalaryService.findAll();
  }

  @Get('employee/:employeeId')
  async findByEmployeeId(
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ): Promise<EmployeeSalaryResponseDto[]> {
    return await this.employeeSalaryService.findByEmployeeId(employeeId);
  }

  @Get('employee/:employeeId/date-range')
  async findByEmployeeIdAndDateRange(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<EmployeeSalaryResponseDto[]> {
    return await this.employeeSalaryService.findByEmployeeIdAndDateRange(
      employeeId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('status/:status')
  async findByStatus(
    @Param('status') status: string,
  ): Promise<EmployeeSalaryResponseDto[]> {
    return await this.employeeSalaryService.findByStatus(status);
  }

  @Get('period')
  async findByPeriod(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<EmployeeSalaryResponseDto[]> {
    return await this.employeeSalaryService.findByPeriod(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<EmployeeSalaryResponseDto> {
    return await this.employeeSalaryService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createDto: CreateEmployeeSalaryDto,
  ): Promise<EmployeeSalaryResponseDto> {
    return await this.employeeSalaryService.create(createDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateEmployeeSalaryDto,
  ): Promise<EmployeeSalaryResponseDto> {
    return await this.employeeSalaryService.update(id, updateDto);
  }
}

