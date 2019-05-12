import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelContractComponent } from './cancelcontract.component';

describe('CancelContractComponent', () => {
  let component: CancelContractComponent;
  let fixture: ComponentFixture<CancelContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
