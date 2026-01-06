import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { StateService } from '../services/state.service';
import { StateResponseDto } from '../dto/state.dto';

@Controller('lookup/states')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Get()
  async findAll(): Promise<StateResponseDto[]> {
    return await this.stateService.findAll();
  }

  @Get('active')
  async findActive(): Promise<StateResponseDto[]> {
    return await this.stateService.findActive();
  }

  @Get('code/:code')
  async findByCode(@Param('code') code: string): Promise<StateResponseDto> {
    return await this.stateService.findByCode(code);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<StateResponseDto> {
    return await this.stateService.findById(id);
  }
}

