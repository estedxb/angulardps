import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardActionComponent } from './dashboardaction.component';

describe('DashboardActionComponent', () => {
  let component: DashboardActionComponent;
  let fixture: ComponentFixture<DashboardActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardActionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
