import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthCredentialService } from '../services/auth-credential.service';
import { TwoFactorAuthResponseDto } from '../dto/auth-credential.dto';

@Controller('security/credentials')
export class AuthCredentialController {
  constructor(
    private readonly authCredentialService: AuthCredentialService,
  ) {}

  @Get()
  async findAll(): Promise<TwoFactorAuthResponseDto[]> {
    return await this.authCredentialService.findAll();
  }

  @Get('enabled')
  async findEnabled(): Promise<TwoFactorAuthResponseDto[]> {
    return await this.authCredentialService.findEnabled();
  }

  @Get('method/:twoFactorMethod')
  async findByMethod(
    @Param('twoFactorMethod') twoFactorMethod: string,
  ): Promise<TwoFactorAuthResponseDto[]> {
    return await this.authCredentialService.findByMethod(twoFactorMethod);
  }

  @Get('actor/:actorId')
  async findByActorId(
    @Param('actorId', ParseIntPipe) actorId: number,
  ): Promise<TwoFactorAuthResponseDto> {
    return await this.authCredentialService.findByActorId(actorId);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TwoFactorAuthResponseDto> {
    return await this.authCredentialService.findById(id);
  }
}
