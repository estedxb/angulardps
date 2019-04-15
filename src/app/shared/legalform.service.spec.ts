import { TestBed } from '@angular/core/testing';

import { LegalformService } from './legalform.service';

describe('LegalformService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LegalformService = TestBed.get(LegalformService);
    expect(service).toBeTruthy();
  });
});
