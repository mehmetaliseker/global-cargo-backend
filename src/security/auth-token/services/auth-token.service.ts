import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthTokenRepository } from '../repositories/auth-token.repository';
import { TokenInfoResponseDto } from '../dto/auth-token.dto';
import { TokenInfo } from '../repositories/auth-token.repository.interface';

@Injectable()
export class AuthTokenService {
  constructor(private readonly authTokenRepository: AuthTokenRepository) {}

  private mapToDto(tokenInfo: TokenInfo): TokenInfoResponseDto {
    // TODO: Mask token hash in production (never expose full hash)
    // For now, return as-is for debugging purposes
    return {
      sessionId: tokenInfo.sessionId,
      sessionUuid: tokenInfo.sessionUuid,
      actorId: tokenInfo.actorId,
      actorType: tokenInfo.actorType,
      tokenHash: tokenInfo.tokenHash,
      expiresAt: tokenInfo.expiresAt.toISOString(),
      isActive: tokenInfo.isActive,
      lastActivity: tokenInfo.lastActivity.toISOString(),
    };
  }

  async findByTokenHash(tokenHash: string): Promise<TokenInfoResponseDto> {
    const tokenInfo = await this.authTokenRepository.findByTokenHash(tokenHash);
    if (!tokenInfo) {
      throw new NotFoundException(`Token with hash not found`);
    }
    return this.mapToDto(tokenInfo);
  }

  async findActiveTokensByActorId(
    actorId: number,
  ): Promise<TokenInfoResponseDto[]> {
    const tokens = await this.authTokenRepository.findActiveTokensByActorId(
      actorId,
    );
    return tokens.map((token) => this.mapToDto(token));
  }

  async findExpiredTokens(): Promise<TokenInfoResponseDto[]> {
    const tokens = await this.authTokenRepository.findExpiredTokens();
    return tokens.map((token) => this.mapToDto(token));
  }

  async findRevokedTokens(): Promise<TokenInfoResponseDto[]> {
    const tokens = await this.authTokenRepository.findRevokedTokens();
    return tokens.map((token) => this.mapToDto(token));
  }
}
