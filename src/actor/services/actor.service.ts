import { Injectable, NotFoundException } from '@nestjs/common';
import { ActorRepository } from '../repositories/actor.repository';
import { ActorResponseDto, ActorTypeEnum } from '../dto/actor.dto';
import { ActorEntity } from '../repositories/actor.repository.interface';

@Injectable()
export class ActorService {
  constructor(private readonly actorRepository: ActorRepository) {}

  private mapToDto(entity: ActorEntity): ActorResponseDto {
    return {
      id: entity.id,
      uuid: entity.uuid,
      actorType: entity.actor_type as ActorTypeEnum,
      email: entity.email,
      phone: entity.phone,
      address: entity.address,
      isActive: entity.is_active,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<ActorResponseDto[]> {
    const entities = await this.actorRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<ActorResponseDto> {
    const entity = await this.actorRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Actor with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByUuid(uuid: string): Promise<ActorResponseDto> {
    const entity = await this.actorRepository.findByUuid(uuid);
    if (!entity) {
      throw new NotFoundException(`Actor with uuid ${uuid} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByEmail(email: string): Promise<ActorResponseDto> {
    const entity = await this.actorRepository.findByEmail(email);
    if (!entity) {
      throw new NotFoundException(`Actor with email ${email} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByType(actorType: ActorTypeEnum): Promise<ActorResponseDto[]> {
    const entities = await this.actorRepository.findByType(actorType);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findActive(): Promise<ActorResponseDto[]> {
    const entities = await this.actorRepository.findActive();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByTypeAndActive(actorType: ActorTypeEnum): Promise<ActorResponseDto[]> {
    const entities = await this.actorRepository.findByTypeAndActive(actorType);
    return entities.map((entity) => this.mapToDto(entity));
  }
}

