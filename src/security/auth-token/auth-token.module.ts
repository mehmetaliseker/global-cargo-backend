import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { AuthTokenRepository } from './repositories/auth-token.repository';
import { AuthTokenService } from './services/auth-token.service';
import { AuthTokenController } from './controllers/auth-token.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthTokenController],
  providers: [AuthTokenRepository, AuthTokenService],
  exports: [AuthTokenService, AuthTokenRepository],
})
export class AuthTokenModule {}
