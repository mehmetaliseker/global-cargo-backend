import { Controller, Get, Param } from '@nestjs/common';
import { LanguageService } from '../services/language.service';
import { LanguageResponseDto } from '../dto/language.dto';

@Controller('lookup/languages')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Get()
  async findAll(): Promise<LanguageResponseDto[]> {
    return await this.languageService.findAll();
  }

  @Get('active')
  async findActive(): Promise<LanguageResponseDto[]> {
    return await this.languageService.findActive();
  }

  @Get('default')
  async findDefault(): Promise<LanguageResponseDto> {
    return await this.languageService.findDefault();
  }

  @Get(':code')
  async findByCode(@Param('code') code: string): Promise<LanguageResponseDto> {
    return await this.languageService.findByCode(code);
  }
}

