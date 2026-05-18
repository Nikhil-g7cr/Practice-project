import { Logger } from '@nestjs/common';

export const coreProviders = [
  {
    provide: Logger,
    useValue: new Logger(),
  },
];
