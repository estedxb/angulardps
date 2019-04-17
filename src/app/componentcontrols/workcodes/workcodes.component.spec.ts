import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkCodesComponent } from './workcodes.component';

describe('CodesComponent', () => {
  let component: WorkCodesComponent;
  let fixture: ComponentFixture<WorkCodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkCodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
