import { TestBed } from '@angular/core/testing';

import { AADUserGroupService } from './a-aduser-group.service';

describe('AADUserGroupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AADUserGroupService = TestBed.get(AADUserGroupService);
    expect(service).toBeTruthy();
  });
});
