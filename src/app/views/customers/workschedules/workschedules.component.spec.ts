import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkschedulesComponent } from './workschedule.component';

describe('WorkschedulesComponent', () => {
  let component: WorkschedulesComponent;
  let fixture: ComponentFixture<WorkschedulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WorkschedulesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkschedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
