import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWorkTimeComponent } from './createworktime.component';

describe('CreateworktimeComponent', () => {
  let component: CreateWorkTimeComponent;
  let fixture: ComponentFixture<CreateWorkTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateWorkTimeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWorkTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
