import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleRepository } from '../repositories/role.repository';
import { RoleResponseDto } from '../dto/role.dto';
import { RoleEntity } from '../repositories/role.repository.interface';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  private mapToDto(entity: RoleEntity): RoleResponseDto {
    return {
      id: entity.id,
      uuid: entity.uuid,
      code: entity.code,
      name: entity.name,
      description: entity.description,
      isActive: entity.is_active,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<RoleResponseDto[]> {
    const entities = await this.roleRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<RoleResponseDto> {
    const entity = await this.roleRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByUuid(uuid: string): Promise<RoleResponseDto> {
    const entity = await this.roleRepository.findByUuid(uuid);
    if (!entity) {
      throw new NotFoundException(`Role with uuid ${uuid} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByCode(code: string): Promise<RoleResponseDto> {
    const entity = await this.roleRepository.findByCode(code);
    if (!entity) {
      throw new NotFoundException(`Role with code ${code} not found`);
    }
    return this.mapToDto(entity);
  }

  async findActive(): Promise<RoleResponseDto[]> {
    const entities = await this.roleRepository.findActive();
    return entities.map((entity) => this.mapToDto(entity));
  }
}

