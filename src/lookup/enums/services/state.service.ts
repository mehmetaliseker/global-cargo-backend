import { Injectable, NotFoundException } from '@nestjs/common';
import { StateRepository } from '../repositories/state.repository';
import { StateResponseDto } from '../dto/state.dto';
import { StateEntity } from '../repositories/state.repository.interface';

@Injectable()
export class StateService {
  constructor(private readonly stateRepository: StateRepository) {}

  private mapToDto(entity: StateEntity): StateResponseDto {
    return {
      id: entity.id,
      code: entity.code,
      name: entity.name,
      description: entity.description,
      isActive: entity.is_active,
      createdAt: entity.created_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<StateResponseDto[]> {
    const entities = await this.stateRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<StateResponseDto> {
    const entity = await this.stateRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`State with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByCode(code: string): Promise<StateResponseDto> {
    const entity = await this.stateRepository.findByCode(code);
    if (!entity) {
      throw new NotFoundException(`State with code ${code} not found`);
    }
    return this.mapToDto(entity);
  }

  async findActive(): Promise<StateResponseDto[]> {
    const entities = await this.stateRepository.findActive();
    return entities.map((entity) => this.mapToDto(entity));
  }
}

