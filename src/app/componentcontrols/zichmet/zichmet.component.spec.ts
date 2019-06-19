import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZichmetComponent } from './zichmet.component';

describe('ZichmetComponent', () => {
  let component: ZichmetComponent;
  let fixture: ComponentFixture<ZichmetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZichmetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZichmetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
