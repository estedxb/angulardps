import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginbgComponent } from './loginbg.component';

describe('LoginbgComponent', () => {
  let component: LoginbgComponent;
  let fixture: ComponentFixture<LoginbgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginbgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginbgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
