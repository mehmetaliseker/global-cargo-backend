import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RouteService } from '../services/route.service';
import { RouteResponseDto, CreateRouteDto, UpdateRouteDto } from '../dto/route.dto';

@Controller('routing/routes')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @Get()
  async findAll(): Promise<RouteResponseDto[]> {
    return await this.routeService.findAll();
  }

  @Get('active')
  async findActive(): Promise<RouteResponseDto[]> {
    return await this.routeService.findActive();
  }

  @Get('origin/:originId')
  async findByOriginDistributionCenterId(
    @Param('originId', ParseIntPipe) originId: number,
  ): Promise<RouteResponseDto[]> {
    return await this.routeService.findByOriginDistributionCenterId(originId);
  }

  @Get('destination/:destinationId')
  async findByDestinationDistributionCenterId(
    @Param('destinationId', ParseIntPipe) destinationId: number,
  ): Promise<RouteResponseDto[]> {
    return await this.routeService.findByDestinationDistributionCenterId(
      destinationId,
    );
  }

  @Get('shipment-type/:shipmentTypeId')
  async findByShipmentTypeId(
    @Param('shipmentTypeId', ParseIntPipe) shipmentTypeId: number,
  ): Promise<RouteResponseDto[]> {
    return await this.routeService.findByShipmentTypeId(shipmentTypeId);
  }

  @Get('main-route/:mainRouteId')
  async findByMainRouteId(
    @Param('mainRouteId', ParseIntPipe) mainRouteId: number,
  ): Promise<RouteResponseDto[]> {
    return await this.routeService.findByMainRouteId(mainRouteId);
  }

  @Get('main-route/:mainRouteId/alternatives')
  async findAlternativeRoutes(
    @Param('mainRouteId', ParseIntPipe) mainRouteId: number,
  ): Promise<RouteResponseDto[]> {
    return await this.routeService.findAlternativeRoutes(mainRouteId);
  }

  @Get('code/:routeCode')
  async findByRouteCode(
    @Param('routeCode') routeCode: string,
  ): Promise<RouteResponseDto> {
    return await this.routeService.findByRouteCode(routeCode);
  }

  @Get('uuid/:uuid')
  async findByUuid(@Param('uuid') uuid: string): Promise<RouteResponseDto> {
    return await this.routeService.findByUuid(uuid);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<RouteResponseDto> {
    return await this.routeService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateRouteDto): Promise<RouteResponseDto> {
    return await this.routeService.create(createDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateRouteDto,
  ): Promise<RouteResponseDto> {
    return await this.routeService.update(id, updateDto);
  }
}

