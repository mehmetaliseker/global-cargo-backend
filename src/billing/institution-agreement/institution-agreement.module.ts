import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { InstitutionAgreementRepository } from './repositories/institution-agreement.repository';
import { InstitutionAgreementService } from './services/institution-agreement.service';
import { InstitutionAgreementController } from './controllers/institution-agreement.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [InstitutionAgreementController],
  providers: [InstitutionAgreementRepository, InstitutionAgreementService],
  exports: [InstitutionAgreementService, InstitutionAgreementRepository],
})
export class InstitutionAgreementModule {}

