import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonPositionComponent } from './personposition.component';

describe('PersonPositionComponent', () => {
  let component: PersonPositionComponent;
  let fixture: ComponentFixture<PersonPositionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PersonPositionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
