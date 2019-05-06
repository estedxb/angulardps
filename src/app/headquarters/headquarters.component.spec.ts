import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadQuartersComponent } from './headquarters.component';

describe('HeadQuartersComponent', () => {
  let component: HeadQuartersComponent;
  let fixture: ComponentFixture<HeadQuartersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeadQuartersComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadQuartersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
