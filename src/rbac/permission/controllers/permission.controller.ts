import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PermissionService } from '../services/permission.service';
import { PermissionResponseDto } from '../dto/permission.dto';

@Controller('rbac/permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  async findAll(): Promise<PermissionResponseDto[]> {
    return await this.permissionService.findAll();
  }

  @Get('active')
  async findActive(): Promise<PermissionResponseDto[]> {
    return await this.permissionService.findActive();
  }

  @Get('resource/:resource')
  async findByResource(
    @Param('resource') resource: string,
  ): Promise<PermissionResponseDto[]> {
    return await this.permissionService.findByResource(resource);
  }

  @Get('resource/:resource/active')
  async findByResourceAndActive(
    @Param('resource') resource: string,
  ): Promise<PermissionResponseDto[]> {
    return await this.permissionService.findByResourceAndActive(resource);
  }

  @Get('code/:code')
  async findByCode(@Param('code') code: string): Promise<PermissionResponseDto> {
    return await this.permissionService.findByCode(code);
  }

  @Get('uuid/:uuid')
  async findByUuid(@Param('uuid') uuid: string): Promise<PermissionResponseDto> {
    return await this.permissionService.findByUuid(uuid);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PermissionResponseDto> {
    return await this.permissionService.findById(id);
  }
}

