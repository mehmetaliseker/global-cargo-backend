import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PromotionService } from '../services/promotion.service';
import { PromotionResponseDto } from '../dto/promotion.dto';

@Controller('promotion/promotions')
export class PromotionController {
    constructor(private readonly promotionService: PromotionService) { }

    @Get()
    async findAll(): Promise<PromotionResponseDto[]> {
        return await this.promotionService.findAll();
    }

    @Get('active')
    async findActive(): Promise<PromotionResponseDto[]> {
        return await this.promotionService.findActive();
    }

    @Get('valid')
    async findValidPromotions(): Promise<PromotionResponseDto[]> {
        return await this.promotionService.findValidPromotions();
    }

    @Get('code/:promotionCode')
    async findByPromotionCode(
        @Param('promotionCode') promotionCode: string,
    ): Promise<PromotionResponseDto> {
        return await this.promotionService.findByPromotionCode(promotionCode);
    }

    @Get('uuid/:uuid')
    async findByUuid(@Param('uuid') uuid: string): Promise<PromotionResponseDto> {
        return await this.promotionService.findByUuid(uuid);
    }

    @Get(':id')
    async findById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<PromotionResponseDto> {
        return await this.promotionService.findById(id);
    }
}
