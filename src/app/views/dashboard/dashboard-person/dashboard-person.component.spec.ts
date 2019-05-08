import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPersonComponent } from './dashboard-person.component';

describe('DashboardPersonComponent', () => {
  let component: DashboardPersonComponent;
  let fixture: ComponentFixture<DashboardPersonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardPersonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
