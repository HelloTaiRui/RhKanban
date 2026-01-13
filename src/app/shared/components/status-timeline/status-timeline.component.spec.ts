import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RhStatusTimelineComponent } from './status-timeline.component';

describe('StatusTimelineComponent', () => {
  let component: RhStatusTimelineComponent;
  let fixture: ComponentFixture<RhStatusTimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RhStatusTimelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RhStatusTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
