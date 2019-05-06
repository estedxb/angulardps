import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonpositionComponent } from './personposition.component';

describe('PersonpositionComponent', () => {
  let component: PersonpositionComponent;
  let fixture: ComponentFixture<PersonpositionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonpositionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonpositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
