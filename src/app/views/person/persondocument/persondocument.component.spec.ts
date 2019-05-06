import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonDocumentComponent } from './persondocument.component';

describe('PersonDocumentComponent', () => {
  let component: PersonDocumentComponent;
  let fixture: ComponentFixture<PersonDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PersonDocumentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
