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
import { CountryModule } from './location/country/country.module';
import { CountryRiskModule } from './location/country-risk/country-risk.module';
import { RegionModule } from './location/region/region.module';
import { CityModule } from './location/city/city.module';
import { DistrictModule } from './location/district/district.module';
import { BranchModule } from './location/branch/branch.module';
import { DistributionCenterModule } from './location/distribution-center/distribution-center.module';
import { ActorModule } from './actor/actor.module';
import { CustomerModule } from './actor/customer/customer.module';
import { EmployeeModule } from './actor/employee/employee.module';
import { PartnerModule } from './actor/partner/partner.module';
import { RoleModule } from './rbac/role/role.module';
import { PermissionModule } from './rbac/permission/permission.module';
import { RolePermissionModule } from './rbac/role-permission/role-permission.module';
import { EmployeeRoleModule } from './rbac/employee-role/employee-role.module';
import { CargoModule } from './cargo/cargo/cargo.module';
import { ProductModule } from './cargo/product/product.module';
import { CargoStateHistoryModule } from './cargo/cargo-state-history/cargo-state-history.module';
import { CargoMovementHistoryModule } from './cargo/cargo-movement-history/cargo-movement-history.module';
import { CargoDeliveryPreferenceModule } from './cargo/cargo-delivery-preference/cargo-delivery-preference.module';
import { CargoReturnRequestModule } from './cargo/cargo-return-request/cargo-return-request.module';
import { CargoDamageReportModule } from './cargo/cargo-damage-report/cargo-damage-report.module';
import { CargoEventLogModule } from './cargo/cargo-event-log/cargo-event-log.module';
import { PricingCalculationModule } from './billing/pricing-calculation/pricing-calculation.module';
import { PricingCalculationDetailModule } from './billing/pricing-calculation-detail/pricing-calculation-detail.module';
import { InstitutionAgreementModule } from './billing/institution-agreement/institution-agreement.module';
import { InvoiceModule } from './billing/invoice/invoice.module';
import { PaymentModule } from './billing/payment/payment.module';
import { PaymentRefundModule } from './billing/payment-refund/payment-refund.module';
import { CustomsModule } from './customs/customs.module';
import { InsuranceModule } from './insurance/insurance.module';
import { RoutingModule } from './routing/routing.module';
import { HrModule } from './hr/hr.module';
import { IntegrationModule } from './integration/integration.module';
import { SupportModule } from './support/support.module';

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
    CountryModule,
    CountryRiskModule,
    RegionModule,
    CityModule,
    DistrictModule,
    BranchModule,
    DistributionCenterModule,
    ActorModule,
    CustomerModule,
    EmployeeModule,
    PartnerModule,
    RoleModule,
    PermissionModule,
    RolePermissionModule,
    EmployeeRoleModule,
    CargoModule,
    ProductModule,
    CargoStateHistoryModule,
    CargoMovementHistoryModule,
    CargoDeliveryPreferenceModule,
    CargoReturnRequestModule,
    CargoDamageReportModule,
    CargoEventLogModule,
    PricingCalculationModule,
    PricingCalculationDetailModule,
    InstitutionAgreementModule,
    InvoiceModule,
    PaymentModule,
    PaymentRefundModule,
    CustomsModule,
    InsuranceModule,
    RoutingModule,
    HrModule,
    IntegrationModule,
    SupportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
