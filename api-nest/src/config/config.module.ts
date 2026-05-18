import { Module } from '@nestjs/common';
import { AppConfigService } from './appconfig.service';

@Module({
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class ConfigModule {}
