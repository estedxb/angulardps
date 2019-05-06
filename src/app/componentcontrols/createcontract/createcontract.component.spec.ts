import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatecontractComponent } from './createcontract.component';

describe('CreatecontractComponent', () => {
  let component: CreatecontractComponent;
  let fixture: ComponentFixture<CreatecontractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatecontractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatecontractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
