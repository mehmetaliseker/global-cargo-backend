import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseService } from './database.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DatabaseService,
      useFactory: (configService: ConfigService) => {
        return new DatabaseService(configService);
      },
      inject: [ConfigService],
    },
  ],
  exports: [DatabaseService],
})
export class DatabaseModule {}

