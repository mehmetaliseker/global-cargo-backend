import { Module } from '@nestjs/common';
import { AuthSessionModule } from './auth-session/auth-session.module';
import { AuthCredentialModule } from './auth-credential/auth-credential.module';
import { AuthTokenModule } from './auth-token/auth-token.module';
import { SecurityEventModule } from './security-event/security-event.module';

@Module({
  imports: [
    AuthSessionModule,
    AuthCredentialModule,
    AuthTokenModule,
    SecurityEventModule,
  ],
  exports: [
    AuthSessionModule,
    AuthCredentialModule,
    AuthTokenModule,
    SecurityEventModule,
  ],
})
export class SecurityModule {}
