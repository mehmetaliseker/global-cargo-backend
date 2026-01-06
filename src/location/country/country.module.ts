import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { CountryRepository } from './repositories/country.repository';
import { CountryService } from './services/country.service';
import { CountryController } from './controllers/country.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [CountryController],
  providers: [CountryRepository, CountryService],
  exports: [CountryService, CountryRepository],
})
export class CountryModule {}

