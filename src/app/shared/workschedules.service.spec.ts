import { TestBed } from '@angular/core/testing';

import { WorkschedulesService } from './workschedules.service';

describe('WorkschedulesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkschedulesService = TestBed.get(WorkschedulesService);
    expect(service).toBeTruthy();
  });
});
