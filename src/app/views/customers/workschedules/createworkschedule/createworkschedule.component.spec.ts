import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateworkscheduleComponent } from './createworkschedule.component';

describe('CreateworkscheduleComponent', () => {
  let component: CreateworkscheduleComponent;
  let fixture: ComponentFixture<CreateworkscheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateworkscheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateworkscheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
