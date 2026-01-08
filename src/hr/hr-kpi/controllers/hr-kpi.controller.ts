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
import { HrKpiService } from '../services/hr-kpi.service';
import {
  HrKpiResponseDto,
  CreateHrKpiDto,
  UpdateHrKpiDto,
} from '../dto/hr-kpi.dto';

@Controller('hr/kpis')
export class HrKpiController {
  constructor(private readonly hrKpiService: HrKpiService) {}

  @Get()
  async findAll(): Promise<HrKpiResponseDto[]> {
    return await this.hrKpiService.findAll();
  }

  @Get('employee/:employeeId')
  async findByEmployeeId(
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ): Promise<HrKpiResponseDto[]> {
    return await this.hrKpiService.findByEmployeeId(employeeId);
  }

  @Get('employee/:employeeId/kpi-type/:kpiType')
  async findByEmployeeIdAndKpiType(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Param('kpiType') kpiType: string,
  ): Promise<HrKpiResponseDto[]> {
    return await this.hrKpiService.findByEmployeeIdAndKpiType(
      employeeId,
      kpiType,
    );
  }

  @Get('kpi-type/:kpiType')
  async findByKpiType(
    @Param('kpiType') kpiType: string,
  ): Promise<HrKpiResponseDto[]> {
    return await this.hrKpiService.findByKpiType(kpiType);
  }

  @Get('period')
  async findByPeriod(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<HrKpiResponseDto[]> {
    return await this.hrKpiService.findByPeriod(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<HrKpiResponseDto> {
    return await this.hrKpiService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateHrKpiDto): Promise<HrKpiResponseDto> {
    return await this.hrKpiService.create(createDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateHrKpiDto,
  ): Promise<HrKpiResponseDto> {
    return await this.hrKpiService.update(id, updateDto);
  }
}

