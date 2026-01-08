import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { UserSessionService } from '../services/auth-session.service';
import { LoginHistoryService } from '../services/auth-session.service';
import {
  UserSessionResponseDto,
  LoginHistoryResponseDto,
} from '../dto/auth-session.dto';

@Controller('security/sessions')
export class UserSessionController {
  constructor(
    private readonly userSessionService: UserSessionService,
  ) {}

  @Get()
  async findAll(): Promise<UserSessionResponseDto[]> {
    return await this.userSessionService.findAll();
  }

  @Get('active')
  async findActive(): Promise<UserSessionResponseDto[]> {
    return await this.userSessionService.findActive();
  }

  @Get('expired')
  async findExpired(): Promise<UserSessionResponseDto[]> {
    return await this.userSessionService.findExpired();
  }

  @Get('actor/:actorId')
  async findByActorId(
    @Param('actorId', ParseIntPipe) actorId: number,
  ): Promise<UserSessionResponseDto[]> {
    return await this.userSessionService.findByActorId(actorId);
  }

  @Get('actor/:actorId/active')
  async findByActorIdActive(
    @Param('actorId', ParseIntPipe) actorId: number,
  ): Promise<UserSessionResponseDto[]> {
    return await this.userSessionService.findByActorIdActive(actorId);
  }

  @Get('uuid/:uuid')
  async findByUuid(
    @Param('uuid') uuid: string,
  ): Promise<UserSessionResponseDto> {
    return await this.userSessionService.findByUuid(uuid);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserSessionResponseDto> {
    return await this.userSessionService.findById(id);
  }
}

@Controller('security/login-history')
export class LoginHistoryController {
  constructor(
    private readonly loginHistoryService: LoginHistoryService,
  ) {}

  @Get()
  async findAll(): Promise<LoginHistoryResponseDto[]> {
    return await this.loginHistoryService.findAll();
  }

  @Get('failed')
  async findFailed(): Promise<LoginHistoryResponseDto[]> {
    return await this.loginHistoryService.findFailed();
  }

  @Get('successful')
  async findSuccessful(): Promise<LoginHistoryResponseDto[]> {
    return await this.loginHistoryService.findSuccessful();
  }

  @Get('status/:loginStatus')
  async findByLoginStatus(
    @Param('loginStatus') loginStatus: string,
  ): Promise<LoginHistoryResponseDto[]> {
    return await this.loginHistoryService.findByLoginStatus(loginStatus);
  }

  @Get('actor/:actorId')
  async findByActorId(
    @Param('actorId', ParseIntPipe) actorId: number,
  ): Promise<LoginHistoryResponseDto[]> {
    return await this.loginHistoryService.findByActorId(actorId);
  }

  @Get('time-range')
  async findByLoginTimeRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<LoginHistoryResponseDto[]> {
    return await this.loginHistoryService.findByLoginTimeRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<LoginHistoryResponseDto> {
    return await this.loginHistoryService.findById(id);
  }
}
