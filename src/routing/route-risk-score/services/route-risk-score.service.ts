import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { RouteRiskScoreRepository } from '../repositories/route-risk-score.repository';
import {
  RouteRiskScoreResponseDto,
  CreateRouteRiskScoreDto,
  UpdateRouteRiskScoreDto,
} from '../dto/route-risk-score.dto';
import { RouteRiskScoreEntity } from '../repositories/route-risk-score.repository.interface';

@Injectable()
export class RouteRiskScoreService {
  constructor(
    private readonly routeRiskScoreRepository: RouteRiskScoreRepository,
  ) {}

  private mapToDto(entity: RouteRiskScoreEntity): RouteRiskScoreResponseDto {
    return {
      id: entity.id,
      routeId: entity.route_id,
      originCountryId: entity.origin_country_id,
      destinationCountryId: entity.destination_country_id,
      riskLevel: entity.risk_level,
      riskScore: parseFloat(entity.risk_score.toString()),
      minimumRiskThreshold: parseFloat(entity.minimum_risk_threshold.toString()),
      updatedAt: entity.updated_at.toISOString(),
      createdAt: entity.created_at.toISOString(),
    };
  }

  async findAll(): Promise<RouteRiskScoreResponseDto[]> {
    const entities = await this.routeRiskScoreRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<RouteRiskScoreResponseDto> {
    const entity = await this.routeRiskScoreRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Route risk score with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByRouteId(routeId: number): Promise<RouteRiskScoreResponseDto | null> {
    const entity = await this.routeRiskScoreRepository.findByRouteId(routeId);
    if (!entity) {
      return null;
    }
    return this.mapToDto(entity);
  }

  async findByOriginCountryId(
    originCountryId: number,
  ): Promise<RouteRiskScoreResponseDto[]> {
    const entities =
      await this.routeRiskScoreRepository.findByOriginCountryId(originCountryId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByDestinationCountryId(
    destinationCountryId: number,
  ): Promise<RouteRiskScoreResponseDto[]> {
    const entities =
      await this.routeRiskScoreRepository.findByDestinationCountryId(
        destinationCountryId,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByCountries(
    originCountryId: number,
    destinationCountryId: number,
  ): Promise<RouteRiskScoreResponseDto[]> {
    const entities = await this.routeRiskScoreRepository.findByCountries(
      originCountryId,
      destinationCountryId,
    );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByRiskLevel(riskLevel: string): Promise<RouteRiskScoreResponseDto[]> {
    const entities = await this.routeRiskScoreRepository.findByRiskLevel(
      riskLevel,
    );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async create(
    createDto: CreateRouteRiskScoreDto,
  ): Promise<RouteRiskScoreResponseDto> {
    if (createDto.riskScore < createDto.minimumRiskThreshold) {
      throw new BadRequestException(
        `Risk score (${createDto.riskScore}) cannot be less than minimum risk threshold (${createDto.minimumRiskThreshold})`,
      );
    }

    if (createDto.originCountryId === createDto.destinationCountryId) {
      throw new BadRequestException(
        'Origin and destination countries cannot be the same',
      );
    }

    const existing = await this.routeRiskScoreRepository.findByRouteId(
      createDto.routeId,
    );
    if (existing) {
      throw new BadRequestException(
        `Risk score already exists for route ${createDto.routeId}`,
      );
    }

    const entity = await this.routeRiskScoreRepository.create(
      createDto.routeId,
      createDto.originCountryId,
      createDto.destinationCountryId,
      createDto.riskLevel,
      createDto.riskScore,
      createDto.minimumRiskThreshold,
    );

    return this.mapToDto(entity);
  }

  async update(
    id: number,
    updateDto: UpdateRouteRiskScoreDto,
  ): Promise<RouteRiskScoreResponseDto> {
    const existing = await this.routeRiskScoreRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Route risk score with id ${id} not found`);
    }

    if (updateDto.riskScore < updateDto.minimumRiskThreshold) {
      throw new BadRequestException(
        `Risk score (${updateDto.riskScore}) cannot be less than minimum risk threshold (${updateDto.minimumRiskThreshold})`,
      );
    }

    const entity = await this.routeRiskScoreRepository.update(
      id,
      updateDto.riskLevel,
      updateDto.riskScore,
      updateDto.minimumRiskThreshold,
    );

    return this.mapToDto(entity);
  }
}

