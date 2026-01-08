import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import {
  UserSessionRepository,
  LoginHistoryRepository,
} from './repositories/auth-session.repository';
import {
  UserSessionService,
  LoginHistoryService,
} from './services/auth-session.service';
import {
  UserSessionController,
  LoginHistoryController,
} from './controllers/auth-session.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [UserSessionController, LoginHistoryController],
  providers: [
    UserSessionRepository,
    LoginHistoryRepository,
    UserSessionService,
    LoginHistoryService,
  ],
  exports: [
    UserSessionService,
    LoginHistoryService,
    UserSessionRepository,
    LoginHistoryRepository,
  ],
})
export class AuthSessionModule {}
