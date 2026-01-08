import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { PackagingTypeService } from '../services/packaging-type.service';
import { PackagingTypeResponseDto } from '../dto/packaging-type.dto';

@Controller('barcode/packaging-types')
export class PackagingTypeController {
  constructor(
    private readonly packagingTypeService: PackagingTypeService,
  ) {}

  @Get()
  async findAll(): Promise<PackagingTypeResponseDto[]> {
    return await this.packagingTypeService.findAll();
  }

  @Get('active')
  async findActive(): Promise<PackagingTypeResponseDto[]> {
    return await this.packagingTypeService.findActive();
  }

  @Get('code/:typeCode')
  async findByCode(
    @Param('typeCode') typeCode: string,
  ): Promise<PackagingTypeResponseDto> {
    return await this.packagingTypeService.findByCode(typeCode);
  }

  @Get('uuid/:uuid')
  async findByUuid(
    @Param('uuid') uuid: string,
  ): Promise<PackagingTypeResponseDto> {
    return await this.packagingTypeService.findByUuid(uuid);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PackagingTypeResponseDto> {
    return await this.packagingTypeService.findById(id);
  }
}
