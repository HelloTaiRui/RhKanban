import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RhSegmentComponent } from './segment.component';

describe('SegmentComponent', () => {
  let component: RhSegmentComponent;
  let fixture: ComponentFixture<RhSegmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RhSegmentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RhSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
