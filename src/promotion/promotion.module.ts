import { Module } from '@nestjs/common';
import { PromotionModule as PromotionSubModule } from './promotion/promotion.module';

@Module({
    imports: [PromotionSubModule],
    exports: [PromotionSubModule],
})
export class PromotionModule { }
