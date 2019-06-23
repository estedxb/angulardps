import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateLoginComponent } from './validate-login.component';

describe('UpdateLoginComponent', () => {
  let component: ValidateLoginComponent;
  let fixture: ComponentFixture<ValidateLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ValidateLoginComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
