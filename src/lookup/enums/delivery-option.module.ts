import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { DeliveryOptionRepository } from './repositories/delivery-option.repository';
import { DeliveryOptionService } from './services/delivery-option.service';
import { DeliveryOptionController } from './controllers/delivery-option.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [DeliveryOptionController],
  providers: [DeliveryOptionRepository, DeliveryOptionService],
  exports: [DeliveryOptionService, DeliveryOptionRepository],
})
export class DeliveryOptionModule {}

