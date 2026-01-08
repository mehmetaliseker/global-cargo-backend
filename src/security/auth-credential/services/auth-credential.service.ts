import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthCredentialRepository } from '../repositories/auth-credential.repository';
import { TwoFactorAuthResponseDto } from '../dto/auth-credential.dto';
import { TwoFactorAuthEntity } from '../repositories/auth-credential.repository.interface';

@Injectable()
export class AuthCredentialService {
  constructor(
    private readonly authCredentialRepository: AuthCredentialRepository,
  ) {}

  private mapToDto(entity: TwoFactorAuthEntity): TwoFactorAuthResponseDto {
    // TODO: Implement proper encryption/decryption logic in future migrations
    // TODO: Never expose encrypted fields in production - mask them as "***ENCRYPTED***"
    // For now, return null/undefined for encrypted fields (security best practice)
    return {
      id: entity.id,
      actorId: entity.actor_id,
      twoFactorMethod: entity.two_factor_method,
      secretKeyEncrypted: entity.secret_key_encrypted
        ? '***ENCRYPTED***'
        : undefined,
      backupCodesEncrypted: entity.backup_codes_encrypted
        ? '***ENCRYPTED***'
        : undefined,
      phoneNumberEncrypted: entity.phone_number_encrypted
        ? '***ENCRYPTED***'
        : undefined,
      isEnabled: entity.is_enabled,
      lastUsedAt: entity.last_used_at?.toISOString(),
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
    };
  }

  async findAll(): Promise<TwoFactorAuthResponseDto[]> {
    const entities = await this.authCredentialRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<TwoFactorAuthResponseDto> {
    const entity = await this.authCredentialRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(
        `Two-factor auth credential with id ${id} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByActorId(actorId: number): Promise<TwoFactorAuthResponseDto> {
    const entity = await this.authCredentialRepository.findByActorId(actorId);
    if (!entity) {
      throw new NotFoundException(
        `Two-factor auth credential for actor ${actorId} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findEnabled(): Promise<TwoFactorAuthResponseDto[]> {
    const entities = await this.authCredentialRepository.findEnabled();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByMethod(
    twoFactorMethod: string,
  ): Promise<TwoFactorAuthResponseDto[]> {
    const entities =
      await this.authCredentialRepository.findByMethod(twoFactorMethod);
    return entities.map((entity) => this.mapToDto(entity));
  }
}
