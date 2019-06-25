import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarDOBComponent } from './calendardob.component';

describe('CalendarComponent', () => {
  let component: CalendarDOBComponent;
  let fixture: ComponentFixture<CalendarDOBComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarDOBComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarDOBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
