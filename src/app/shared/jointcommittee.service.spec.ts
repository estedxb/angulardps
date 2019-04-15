import { TestBed } from '@angular/core/testing';

import { JointcommitteeService } from './jointcommittee.service';

describe('JointcommitteeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JointcommitteeService = TestBed.get(JointcommitteeService);
    expect(service).toBeTruthy();
  });
});
