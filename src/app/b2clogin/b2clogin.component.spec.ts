import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2cloginComponent } from './b2clogin.component';

describe('B2cloginComponent', () => {
  let component: B2cloginComponent;
  let fixture: ComponentFixture<B2cloginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2cloginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2cloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
