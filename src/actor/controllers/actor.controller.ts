import { Controller, Get, Param, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { ActorService } from '../services/actor.service';
import { ActorResponseDto, ActorTypeEnum } from '../dto/actor.dto';

@Controller('actors')
export class ActorController {
  constructor(private readonly actorService: ActorService) {}

  @Get()
  async findAll(): Promise<ActorResponseDto[]> {
    return await this.actorService.findAll();
  }

  @Get('active')
  async findActive(): Promise<ActorResponseDto[]> {
    return await this.actorService.findActive();
  }

  @Get('type/:type')
  async findByType(@Param('type') type: string): Promise<ActorResponseDto[]> {
    const actorType = type as ActorTypeEnum;
    if (!Object.values(ActorTypeEnum).includes(actorType)) {
      throw new BadRequestException(`Invalid actor type: ${type}. Must be one of: ${Object.values(ActorTypeEnum).join(', ')}`);
    }
    return await this.actorService.findByType(actorType);
  }

  @Get('type/:type/active')
  async findByTypeAndActive(@Param('type') type: string): Promise<ActorResponseDto[]> {
    const actorType = type as ActorTypeEnum;
    if (!Object.values(ActorTypeEnum).includes(actorType)) {
      throw new BadRequestException(`Invalid actor type: ${type}. Must be one of: ${Object.values(ActorTypeEnum).join(', ')}`);
    }
    return await this.actorService.findByTypeAndActive(actorType);
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string): Promise<ActorResponseDto> {
    return await this.actorService.findByEmail(email);
  }

  @Get('uuid/:uuid')
  async findByUuid(@Param('uuid') uuid: string): Promise<ActorResponseDto> {
    return await this.actorService.findByUuid(uuid);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ActorResponseDto> {
    return await this.actorService.findById(id);
  }
}

