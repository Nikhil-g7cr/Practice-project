import { Global, Module } from '@nestjs/common';
import { coreProviders } from './providers';

@Global()
@Module({
  providers: coreProviders,
  exports: coreProviders,
})
export class CoreModule {}
