import { TestBed } from '@angular/core/testing';

import { WorkscheduleService } from './workschedule.service';

describe('WorkscheduleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkscheduleService = TestBed.get(WorkscheduleService);
    expect(service).toBeTruthy();
  });
});
