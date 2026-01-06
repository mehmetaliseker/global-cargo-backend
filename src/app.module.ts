import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CurrencyModule } from './lookup/enums/currency.module';
import { StateModule } from './lookup/enums/state.module';
import { ShipmentTypeModule } from './lookup/enums/shipment-type.module';
import { DeliveryOptionModule } from './lookup/enums/delivery-option.module';
import { CargoTypeModule } from './lookup/enums/cargo-type.module';
import { PaymentMethodModule } from './lookup/enums/payment-method.module';
import { PaymentStatusModule } from './lookup/enums/payment-status.module';
import { LanguageModule } from './lookup/language/language.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    CurrencyModule,
    StateModule,
    ShipmentTypeModule,
    DeliveryOptionModule,
    CargoTypeModule,
    PaymentMethodModule,
    PaymentStatusModule,
    LanguageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
