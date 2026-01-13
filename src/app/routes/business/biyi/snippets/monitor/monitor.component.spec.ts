import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RhMonitorComponent } from './monitor.component';

describe('MonitorComponent', () => {
  let component: RhMonitorComponent;
  let fixture: ComponentFixture<RhMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RhMonitorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RhMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
