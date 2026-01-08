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
import { EmployeeLeaveRequestService } from '../services/employee-leave-request.service';
import {
  EmployeeLeaveRequestResponseDto,
  CreateEmployeeLeaveRequestDto,
  UpdateEmployeeLeaveRequestDto,
} from '../dto/employee-leave-request.dto';

@Controller('hr/leave-requests')
export class EmployeeLeaveRequestController {
  constructor(
    private readonly employeeLeaveRequestService: EmployeeLeaveRequestService,
  ) {}

  @Get()
  async findAll(): Promise<EmployeeLeaveRequestResponseDto[]> {
    return await this.employeeLeaveRequestService.findAll();
  }

  @Get('employee/:employeeId')
  async findByEmployeeId(
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ): Promise<EmployeeLeaveRequestResponseDto[]> {
    return await this.employeeLeaveRequestService.findByEmployeeId(employeeId);
  }

  @Get('employee/:employeeId/status/:status')
  async findByEmployeeIdAndStatus(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Param('status') status: string,
  ): Promise<EmployeeLeaveRequestResponseDto[]> {
    return await this.employeeLeaveRequestService.findByEmployeeIdAndStatus(
      employeeId,
      status,
    );
  }

  @Get('status/:status')
  async findByStatus(
    @Param('status') status: string,
  ): Promise<EmployeeLeaveRequestResponseDto[]> {
    return await this.employeeLeaveRequestService.findByStatus(status);
  }

  @Get('leave-type/:leaveType')
  async findByLeaveType(
    @Param('leaveType') leaveType: string,
  ): Promise<EmployeeLeaveRequestResponseDto[]> {
    return await this.employeeLeaveRequestService.findByLeaveType(leaveType);
  }

  @Get('date-range')
  async findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<EmployeeLeaveRequestResponseDto[]> {
    return await this.employeeLeaveRequestService.findByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<EmployeeLeaveRequestResponseDto> {
    return await this.employeeLeaveRequestService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createDto: CreateEmployeeLeaveRequestDto,
  ): Promise<EmployeeLeaveRequestResponseDto> {
    return await this.employeeLeaveRequestService.create(createDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateEmployeeLeaveRequestDto,
  ): Promise<EmployeeLeaveRequestResponseDto> {
    return await this.employeeLeaveRequestService.update(id, updateDto);
  }
}

