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
import { RouteRiskScoreService } from '../services/route-risk-score.service';
import {
  RouteRiskScoreResponseDto,
  CreateRouteRiskScoreDto,
  UpdateRouteRiskScoreDto,
} from '../dto/route-risk-score.dto';

@Controller('routing/route-risk-scores')
export class RouteRiskScoreController {
  constructor(
    private readonly routeRiskScoreService: RouteRiskScoreService,
  ) {}

  @Get()
  async findAll(): Promise<RouteRiskScoreResponseDto[]> {
    return await this.routeRiskScoreService.findAll();
  }

  @Get('route/:routeId')
  async findByRouteId(
    @Param('routeId', ParseIntPipe) routeId: number,
  ): Promise<RouteRiskScoreResponseDto | null> {
    return await this.routeRiskScoreService.findByRouteId(routeId);
  }

  @Get('origin-country/:originCountryId')
  async findByOriginCountryId(
    @Param('originCountryId', ParseIntPipe) originCountryId: number,
  ): Promise<RouteRiskScoreResponseDto[]> {
    return await this.routeRiskScoreService.findByOriginCountryId(
      originCountryId,
    );
  }

  @Get('destination-country/:destinationCountryId')
  async findByDestinationCountryId(
    @Param('destinationCountryId', ParseIntPipe) destinationCountryId: number,
  ): Promise<RouteRiskScoreResponseDto[]> {
    return await this.routeRiskScoreService.findByDestinationCountryId(
      destinationCountryId,
    );
  }

  @Get('countries/:originCountryId/:destinationCountryId')
  async findByCountries(
    @Param('originCountryId', ParseIntPipe) originCountryId: number,
    @Param('destinationCountryId', ParseIntPipe) destinationCountryId: number,
  ): Promise<RouteRiskScoreResponseDto[]> {
    return await this.routeRiskScoreService.findByCountries(
      originCountryId,
      destinationCountryId,
    );
  }

  @Get('risk-level/:riskLevel')
  async findByRiskLevel(
    @Param('riskLevel') riskLevel: string,
  ): Promise<RouteRiskScoreResponseDto[]> {
    return await this.routeRiskScoreService.findByRiskLevel(riskLevel);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<RouteRiskScoreResponseDto> {
    return await this.routeRiskScoreService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createDto: CreateRouteRiskScoreDto,
  ): Promise<RouteRiskScoreResponseDto> {
    return await this.routeRiskScoreService.create(createDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateRouteRiskScoreDto,
  ): Promise<RouteRiskScoreResponseDto> {
    return await this.routeRiskScoreService.update(id, updateDto);
  }
}

