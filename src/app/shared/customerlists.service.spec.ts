import { TestBed } from '@angular/core/testing';

import { CustomerslistService } from './customerlists.service';

describe('CustomerslistService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomerslistService = TestBed.get(CustomerslistService);
    expect(service).toBeTruthy();
  });
});
