import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditpersonComponent } from './editperson.component';

describe('EditpersonComponent', () => {
  let component: EditpersonComponent;
  let fixture: ComponentFixture<EditpersonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditpersonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditpersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
