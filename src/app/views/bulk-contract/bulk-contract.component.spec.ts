import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkContractComponent } from './bulk-contract.component';

describe('BulkContractComponent', () => {
  let component: BulkContractComponent;
  let fixture: ComponentFixture<BulkContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
