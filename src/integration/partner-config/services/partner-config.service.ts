import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { PartnerConfigRepository } from '../repositories/partner-config.repository';
import { PartnerConfigResponseDto } from '../dto/partner-config.dto';
import { CreatePartnerConfigDto } from '../dto/partner-config.dto';
import { UpdatePartnerConfigDto } from '../dto/partner-config.dto';
import { PartnerConfigEntity } from '../repositories/partner-config.repository.interface';

const scryptAsync = promisify(scrypt);

@Injectable()
export class PartnerConfigService {
  private encryptionKey: Buffer | null = null;

  constructor(
    private readonly partnerConfigRepository: PartnerConfigRepository,
    private readonly configService: ConfigService,
  ) {}

  private getEncryptionKey(): Buffer {
    if (!this.encryptionKey) {
      const keyFromEnv = this.configService.get<string>('API_KEY_ENCRYPTION_KEY');
      if (!keyFromEnv) {
        throw new Error('API_KEY_ENCRYPTION_KEY environment variable is required');
      }
      this.encryptionKey = Buffer.from(keyFromEnv, 'hex');
    }
    return this.encryptionKey;
  }

  private async encryptApiKey(apiKey: string): Promise<Buffer> {
    const encryptionKey = this.getEncryptionKey();
    const iv = randomBytes(16);
    const key = (await scryptAsync(encryptionKey, 'salt', 32)) as Buffer;
    const cipher = createCipheriv('aes-256-cbc', key, iv);
    const encrypted = Buffer.concat([
      cipher.update(apiKey, 'utf8'),
      cipher.final(),
    ]);
    return Buffer.concat([iv, encrypted]);
  }

  private mapToDto(entity: PartnerConfigEntity): PartnerConfigResponseDto {
    let configData: Record<string, unknown> | undefined;
    if (entity.config_data) {
      if (typeof entity.config_data === 'string') {
        configData = JSON.parse(entity.config_data);
      } else {
        configData = entity.config_data as Record<string, unknown>;
      }
    }

    return {
      id: entity.id,
      partnerId: entity.partner_id,
      configData,
      hasApiKey: entity.api_key_encrypted !== null && entity.api_key_encrypted !== undefined,
      isActive: entity.is_active,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<PartnerConfigResponseDto[]> {
    const entities = await this.partnerConfigRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<PartnerConfigResponseDto> {
    const entity = await this.partnerConfigRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Partner config with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByPartnerId(
    partnerId: number,
  ): Promise<PartnerConfigResponseDto | null> {
    const entity = await this.partnerConfigRepository.findByPartnerId(partnerId);
    if (!entity) {
      return null;
    }
    return this.mapToDto(entity);
  }

  async findActive(): Promise<PartnerConfigResponseDto[]> {
    const entities = await this.partnerConfigRepository.findActive();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async create(
    createDto: CreatePartnerConfigDto,
  ): Promise<PartnerConfigResponseDto> {
    const existing = await this.partnerConfigRepository.findByPartnerId(
      createDto.partnerId,
    );
    if (existing) {
      throw new ConflictException(
        `Partner config already exists for partner ${createDto.partnerId}`,
      );
    }

    let apiKeyEncrypted: Buffer | null = null;
    if (createDto.apiKey) {
      if (createDto.apiKey.length === 0) {
        throw new BadRequestException('API key cannot be empty');
      }
      apiKeyEncrypted = await this.encryptApiKey(createDto.apiKey);
    }

    const entity = await this.partnerConfigRepository.create(
      createDto.partnerId,
      createDto.configData ?? null,
      apiKeyEncrypted,
      createDto.isActive ?? true,
    );

    return this.mapToDto(entity);
  }

  async update(
    id: number,
    updateDto: UpdatePartnerConfigDto,
  ): Promise<PartnerConfigResponseDto> {
    const existing = await this.partnerConfigRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Partner config with id ${id} not found`);
    }

    let apiKeyEncrypted: Buffer | null = null;
    if (updateDto.apiKey !== undefined) {
      if (updateDto.apiKey === null || updateDto.apiKey.length === 0) {
        apiKeyEncrypted = null;
      } else {
        apiKeyEncrypted = await this.encryptApiKey(updateDto.apiKey);
      }
    }
    // If apiKey is undefined, pass null to repository
    // Repository uses COALESCE to keep existing value

    const entity = await this.partnerConfigRepository.update(
      id,
      updateDto.configData ?? null,
      apiKeyEncrypted,
      updateDto.isActive ?? existing.is_active,
    );

    return this.mapToDto(entity);
  }

  async softDelete(id: number): Promise<void> {
    const existing = await this.partnerConfigRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Partner config with id ${id} not found`);
    }
    await this.partnerConfigRepository.softDelete(id);
  }
}

