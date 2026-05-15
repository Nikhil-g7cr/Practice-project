import { Test, TestingModule } from '@nestjs/testing';
import { PhonesService } from './phones.service';
import { describe, beforeEach, it } from 'node:test';

describe('PhonesService', () => {
  let service: PhonesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhonesService],
    }).compile();

    service = module.get<PhonesService>(PhonesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
