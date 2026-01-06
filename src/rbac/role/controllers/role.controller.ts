import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { RoleService } from '../services/role.service';
import { RoleResponseDto } from '../dto/role.dto';

@Controller('rbac/roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async findAll(): Promise<RoleResponseDto[]> {
    return await this.roleService.findAll();
  }

  @Get('active')
  async findActive(): Promise<RoleResponseDto[]> {
    return await this.roleService.findActive();
  }

  @Get('code/:code')
  async findByCode(@Param('code') code: string): Promise<RoleResponseDto> {
    return await this.roleService.findByCode(code);
  }

  @Get('uuid/:uuid')
  async findByUuid(@Param('uuid') uuid: string): Promise<RoleResponseDto> {
    return await this.roleService.findByUuid(uuid);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<RoleResponseDto> {
    return await this.roleService.findById(id);
  }
}

