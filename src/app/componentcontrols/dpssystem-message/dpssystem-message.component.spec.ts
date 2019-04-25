import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DPSSystemMessageComponent } from './dpssystem-message.component';

describe('DPSSystemMessageComponent', () => {
  let component: DPSSystemMessageComponent;
  let fixture: ComponentFixture<DPSSystemMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DPSSystemMessageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DPSSystemMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
