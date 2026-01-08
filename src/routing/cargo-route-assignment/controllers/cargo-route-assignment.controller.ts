import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CargoRouteAssignmentService } from '../services/cargo-route-assignment.service';
import {
  CargoRouteAssignmentResponseDto,
  CreateCargoRouteAssignmentDto,
} from '../dto/cargo-route-assignment.dto';

@Controller('routing/cargo-route-assignments')
export class CargoRouteAssignmentController {
  constructor(
    private readonly cargoRouteAssignmentService: CargoRouteAssignmentService,
  ) {}

  @Get()
  async findAll(): Promise<CargoRouteAssignmentResponseDto[]> {
    return await this.cargoRouteAssignmentService.findAll();
  }

  @Get('active')
  async findActive(): Promise<CargoRouteAssignmentResponseDto[]> {
    return await this.cargoRouteAssignmentService.findActive();
  }

  @Get('cargo/:cargoId')
  async findByCargoId(
    @Param('cargoId', ParseIntPipe) cargoId: number,
  ): Promise<CargoRouteAssignmentResponseDto | null> {
    return await this.cargoRouteAssignmentService.findByCargoId(cargoId);
  }

  @Get('cargo/:cargoId/active')
  async findByCargoIdActive(
    @Param('cargoId', ParseIntPipe) cargoId: number,
  ): Promise<CargoRouteAssignmentResponseDto | null> {
    return await this.cargoRouteAssignmentService.findByCargoIdActive(cargoId);
  }

  @Get('route/:routeId')
  async findByRouteId(
    @Param('routeId', ParseIntPipe) routeId: number,
  ): Promise<CargoRouteAssignmentResponseDto[]> {
    return await this.cargoRouteAssignmentService.findByRouteId(routeId);
  }

  @Get('route/:routeId/active')
  async findByRouteIdActive(
    @Param('routeId', ParseIntPipe) routeId: number,
  ): Promise<CargoRouteAssignmentResponseDto[]> {
    return await this.cargoRouteAssignmentService.findByRouteIdActive(routeId);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CargoRouteAssignmentResponseDto> {
    return await this.cargoRouteAssignmentService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createDto: CreateCargoRouteAssignmentDto,
  ): Promise<CargoRouteAssignmentResponseDto> {
    return await this.cargoRouteAssignmentService.create(createDto);
  }

  @Post(':id/deactivate')
  @HttpCode(HttpStatus.OK)
  async deactivate(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CargoRouteAssignmentResponseDto> {
    return await this.cargoRouteAssignmentService.deactivate(id);
  }
}

