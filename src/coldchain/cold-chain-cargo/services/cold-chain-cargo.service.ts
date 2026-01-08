import { Injectable, NotFoundException } from '@nestjs/common';
import { ColdChainCargoRepository } from '../repositories/cold-chain-cargo.repository';
import { ColdChainCargoResponseDto } from '../dto/cold-chain-cargo.dto';
import { ColdChainCargoEntity } from '../repositories/cold-chain-cargo.repository.interface';

@Injectable()
export class ColdChainCargoService {
    constructor(
        private readonly coldChainCargoRepository: ColdChainCargoRepository,
    ) { }

    private mapToDto(entity: ColdChainCargoEntity): ColdChainCargoResponseDto {
        return {
            id: entity.id,
            cargoId: entity.cargo_id,
            requiredTemperatureMin: parseFloat(
                entity.required_temperature_min.toString(),
            ),
            requiredTemperatureMax: parseFloat(
                entity.required_temperature_max.toString(),
            ),
            temperatureUnit: entity.temperature_unit,
            coldChainType: entity.cold_chain_type,
            monitoringRequired: entity.monitoring_required,
            createdAt: entity.created_at.toISOString(),
            updatedAt: entity.updated_at.toISOString(),
        };
    }

    async findAll(): Promise<ColdChainCargoResponseDto[]> {
        const entities = await this.coldChainCargoRepository.findAll();
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findById(id: number): Promise<ColdChainCargoResponseDto> {
        const entity = await this.coldChainCargoRepository.findById(id);
        if (!entity) {
            throw new NotFoundException(`Cold chain cargo with id ${id} not found`);
        }
        return this.mapToDto(entity);
    }

    async findByCargoId(cargoId: number): Promise<ColdChainCargoResponseDto> {
        const entity = await this.coldChainCargoRepository.findByCargoId(cargoId);
        if (!entity) {
            throw new NotFoundException(
                `Cold chain cargo for cargo id ${cargoId} not found`,
            );
        }
        return this.mapToDto(entity);
    }

    async findByColdChainType(
        type: string,
    ): Promise<ColdChainCargoResponseDto[]> {
        const entities =
            await this.coldChainCargoRepository.findByColdChainType(type);
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findMonitoringRequired(): Promise<ColdChainCargoResponseDto[]> {
        const entities =
            await this.coldChainCargoRepository.findMonitoringRequired();
        return entities.map((entity) => this.mapToDto(entity));
    }
}
