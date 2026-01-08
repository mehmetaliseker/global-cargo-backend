import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { AuthCredentialRepository } from './repositories/auth-credential.repository';
import { AuthCredentialService } from './services/auth-credential.service';
import { AuthCredentialController } from './controllers/auth-credential.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthCredentialController],
  providers: [AuthCredentialRepository, AuthCredentialService],
  exports: [AuthCredentialService, AuthCredentialRepository],
})
export class AuthCredentialModule {}
