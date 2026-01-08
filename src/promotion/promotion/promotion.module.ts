import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { PromotionRepository } from './repositories/promotion.repository';
import { PromotionService } from './services/promotion.service';
import { PromotionController } from './controllers/promotion.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [PromotionController],
    providers: [PromotionRepository, PromotionService],
    exports: [PromotionService, PromotionRepository],
})
export class PromotionModule { }
