import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactpersonComponent } from './contactperson.component';

describe('ContactpersonComponent', () => {
  let component: ContactpersonComponent;
  let fixture: ComponentFixture<ContactpersonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactpersonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactpersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
