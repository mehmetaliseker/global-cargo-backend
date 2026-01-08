import { Injectable, NotFoundException } from '@nestjs/common';
import { SystemConfigRepository } from '../repositories/system-config.repository';
import { SystemConfigResponseDto } from '../dto/system-config.dto';
import { SystemConfigEntity } from '../repositories/system-config.repository.interface';

@Injectable()
export class SystemConfigService {
  constructor(
    private readonly systemConfigRepository: SystemConfigRepository,
  ) {}

  private mapToDto(entity: SystemConfigEntity): SystemConfigResponseDto {
    // TODO: Implement real encryption/decryption logic in future migrations
    // Mask encrypted values in API responses
    let configValue: string | undefined = entity.config_value ?? undefined;
    if (entity.is_encrypted && configValue) {
      configValue = '***ENCRYPTED***';
    }

    return {
      id: entity.id,
      configKey: entity.config_key,
      configValue,
      configType: entity.config_type ?? undefined,
      description: entity.description ?? undefined,
      isEncrypted: entity.is_encrypted,
      updatedBy: entity.updated_by ?? undefined,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<SystemConfigResponseDto[]> {
    const entities = await this.systemConfigRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<SystemConfigResponseDto> {
    const entity = await this.systemConfigRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`System config with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByKey(configKey: string): Promise<SystemConfigResponseDto | null> {
    const entity = await this.systemConfigRepository.findByKey(configKey);
    if (!entity) {
      return null;
    }
    return this.mapToDto(entity);
  }

  async findByType(configType: string): Promise<SystemConfigResponseDto[]> {
    const entities = await this.systemConfigRepository.findByType(configType);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findActive(): Promise<SystemConfigResponseDto[]> {
    const entities = await this.systemConfigRepository.findActive();
    return entities.map((entity) => this.mapToDto(entity));
  }
}
