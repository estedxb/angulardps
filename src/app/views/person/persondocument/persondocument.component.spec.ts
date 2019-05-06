import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersondocumentComponent } from './persondocument.component';

describe('PersondocumentComponent', () => {
  let component: PersondocumentComponent;
  let fixture: ComponentFixture<PersondocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersondocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersondocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
