import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateworktimeComponent } from './createworktime.component';

describe('CreateworktimeComponent', () => {
  let component: CreateworktimeComponent;
  let fixture: ComponentFixture<CreateworktimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateworktimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateworktimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
