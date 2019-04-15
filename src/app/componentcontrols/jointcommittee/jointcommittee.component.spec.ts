import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JointcommitteeComponent } from './jointcommittee.component';

describe('JointcommitteeComponent', () => {
  let component: JointcommitteeComponent;
  let fixture: ComponentFixture<JointcommitteeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JointcommitteeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JointcommitteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
