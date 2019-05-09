import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelcontractComponent } from './cancelcontract.component';

describe('CancelcontractComponent', () => {
  let component: CancelcontractComponent;
  let fixture: ComponentFixture<CancelcontractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelcontractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelcontractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
