import { Injectable, NotFoundException } from '@nestjs/common';
import { PermissionRepository } from '../repositories/permission.repository';
import { PermissionResponseDto } from '../dto/permission.dto';
import { PermissionEntity } from '../repositories/permission.repository.interface';

@Injectable()
export class PermissionService {
  constructor(
    private readonly permissionRepository: PermissionRepository,
  ) {}

  private mapToDto(entity: PermissionEntity): PermissionResponseDto {
    return {
      id: entity.id,
      uuid: entity.uuid,
      code: entity.code,
      name: entity.name,
      resource: entity.resource,
      action: entity.action,
      description: entity.description,
      isActive: entity.is_active,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<PermissionResponseDto[]> {
    const entities = await this.permissionRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<PermissionResponseDto> {
    const entity = await this.permissionRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Permission with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByUuid(uuid: string): Promise<PermissionResponseDto> {
    const entity = await this.permissionRepository.findByUuid(uuid);
    if (!entity) {
      throw new NotFoundException(`Permission with uuid ${uuid} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByCode(code: string): Promise<PermissionResponseDto> {
    const entity = await this.permissionRepository.findByCode(code);
    if (!entity) {
      throw new NotFoundException(`Permission with code ${code} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByResource(resource: string): Promise<PermissionResponseDto[]> {
    const entities = await this.permissionRepository.findByResource(resource);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findActive(): Promise<PermissionResponseDto[]> {
    const entities = await this.permissionRepository.findActive();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByResourceAndActive(
    resource: string,
  ): Promise<PermissionResponseDto[]> {
    const entities =
      await this.permissionRepository.findByResourceAndActive(resource);
    return entities.map((entity) => this.mapToDto(entity));
  }
}

