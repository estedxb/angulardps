import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerselectionComponent } from './customerselection.component';

describe('CustomerselectionComponent', () => {
  let component: CustomerselectionComponent;
  let fixture: ComponentFixture<CustomerselectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerselectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerselectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
