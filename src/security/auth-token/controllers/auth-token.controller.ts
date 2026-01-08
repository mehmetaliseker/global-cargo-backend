import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthTokenService } from '../services/auth-token.service';
import { TokenInfoResponseDto } from '../dto/auth-token.dto';

@Controller('security/tokens')
export class AuthTokenController {
  constructor(private readonly authTokenService: AuthTokenService) {}

  @Get('revoked')
  async findRevoked(): Promise<TokenInfoResponseDto[]> {
    return await this.authTokenService.findRevokedTokens();
  }

  @Get('expired')
  async findExpired(): Promise<TokenInfoResponseDto[]> {
    return await this.authTokenService.findExpiredTokens();
  }

  @Get('actor/:actorId/active')
  async findActiveTokensByActorId(
    @Param('actorId', ParseIntPipe) actorId: number,
  ): Promise<TokenInfoResponseDto[]> {
    return await this.authTokenService.findActiveTokensByActorId(actorId);
  }

  @Get('hash/:tokenHash')
  async findByTokenHash(
    @Param('tokenHash') tokenHash: string,
  ): Promise<TokenInfoResponseDto> {
    return await this.authTokenService.findByTokenHash(tokenHash);
  }
}
