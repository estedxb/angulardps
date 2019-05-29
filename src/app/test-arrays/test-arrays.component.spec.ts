import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestArraysComponent } from './test-arrays.component';

describe('TestArraysComponent', () => {
  let component: TestArraysComponent;
  let fixture: ComponentFixture<TestArraysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestArraysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestArraysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
