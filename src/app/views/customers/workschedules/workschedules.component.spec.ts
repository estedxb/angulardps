import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkSchedulesComponent } from './workschedule.component';

describe('WorkSchedulesComponent', () => {
  let component: WorkSchedulesComponent;
  let fixture: ComponentFixture<WorkSchedulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WorkSchedulesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkSchedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
