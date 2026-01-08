import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CourierRoutePlanService } from '../services/courier-route-plan.service';
import {
  CourierRoutePlanResponseDto,
  CreateCourierRoutePlanDto,
  UpdateCourierRoutePlanDto,
} from '../dto/courier-route-plan.dto';

@Controller('routing/courier-route-plans')
export class CourierRoutePlanController {
  constructor(
    private readonly courierRoutePlanService: CourierRoutePlanService,
  ) {}

  @Get()
  async findAll(): Promise<CourierRoutePlanResponseDto[]> {
    return await this.courierRoutePlanService.findAll();
  }

  @Get('employee/:employeeId')
  async findByEmployeeId(
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ): Promise<CourierRoutePlanResponseDto[]> {
    return await this.courierRoutePlanService.findByEmployeeId(employeeId);
  }

  @Get('employee/:employeeId/date')
  async findByEmployeeIdAndDate(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Query('planDate') planDate: string,
  ): Promise<CourierRoutePlanResponseDto[]> {
    return await this.courierRoutePlanService.findByEmployeeIdAndDate(
      employeeId,
      new Date(planDate),
    );
  }

  @Get('route/:routeId')
  async findByRouteId(
    @Param('routeId', ParseIntPipe) routeId: number,
  ): Promise<CourierRoutePlanResponseDto[]> {
    return await this.courierRoutePlanService.findByRouteId(routeId);
  }

  @Get('plan-date')
  async findByPlanDate(
    @Query('planDate') planDate: string,
  ): Promise<CourierRoutePlanResponseDto[]> {
    return await this.courierRoutePlanService.findByPlanDate(new Date(planDate));
  }

  @Get('status/:status')
  async findByStatus(
    @Param('status') status: string,
  ): Promise<CourierRoutePlanResponseDto[]> {
    return await this.courierRoutePlanService.findByStatus(status);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CourierRoutePlanResponseDto> {
    return await this.courierRoutePlanService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createDto: CreateCourierRoutePlanDto,
  ): Promise<CourierRoutePlanResponseDto> {
    return await this.courierRoutePlanService.create(createDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCourierRoutePlanDto,
  ): Promise<CourierRoutePlanResponseDto> {
    return await this.courierRoutePlanService.update(id, updateDto);
  }
}

