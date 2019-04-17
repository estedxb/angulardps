import { TestBed } from '@angular/core/testing';

import { WorkCodesService } from './workcodes.service';

describe('CodesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkCodesService = TestBed.get(WorkCodesService);
    expect(service).toBeTruthy();
  });
});
