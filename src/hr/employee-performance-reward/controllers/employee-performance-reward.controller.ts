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
import { EmployeePerformanceRewardService } from '../services/employee-performance-reward.service';
import {
  EmployeePerformanceRewardResponseDto,
  CreateEmployeePerformanceRewardDto,
  UpdateEmployeePerformanceRewardDto,
} from '../dto/employee-performance-reward.dto';

@Controller('hr/performance-rewards')
export class EmployeePerformanceRewardController {
  constructor(
    private readonly employeePerformanceRewardService: EmployeePerformanceRewardService,
  ) {}

  @Get()
  async findAll(): Promise<EmployeePerformanceRewardResponseDto[]> {
    return await this.employeePerformanceRewardService.findAll();
  }

  @Get('employee/:employeeId')
  async findByEmployeeId(
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ): Promise<EmployeePerformanceRewardResponseDto[]> {
    return await this.employeePerformanceRewardService.findByEmployeeId(
      employeeId,
    );
  }

  @Get('employee/:employeeId/status/:status')
  async findByEmployeeIdAndStatus(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Param('status') status: string,
  ): Promise<EmployeePerformanceRewardResponseDto[]> {
    return await this.employeePerformanceRewardService.findByEmployeeIdAndStatus(
      employeeId,
      status,
    );
  }

  @Get('reward-type/:rewardType')
  async findByRewardType(
    @Param('rewardType') rewardType: string,
  ): Promise<EmployeePerformanceRewardResponseDto[]> {
    return await this.employeePerformanceRewardService.findByRewardType(
      rewardType,
    );
  }

  @Get('status/:status')
  async findByStatus(
    @Param('status') status: string,
  ): Promise<EmployeePerformanceRewardResponseDto[]> {
    return await this.employeePerformanceRewardService.findByStatus(status);
  }

  @Get('performance-period')
  async findByPerformancePeriod(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<EmployeePerformanceRewardResponseDto[]> {
    return await this.employeePerformanceRewardService.findByPerformancePeriod(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<EmployeePerformanceRewardResponseDto> {
    return await this.employeePerformanceRewardService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createDto: CreateEmployeePerformanceRewardDto,
  ): Promise<EmployeePerformanceRewardResponseDto> {
    return await this.employeePerformanceRewardService.create(createDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateEmployeePerformanceRewardDto,
  ): Promise<EmployeePerformanceRewardResponseDto> {
    return await this.employeePerformanceRewardService.update(id, updateDto);
  }
}

