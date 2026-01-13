import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RhPageFrameComponent } from './page-frame.component';

describe('PageFrameComponent', () => {
  let component: RhPageFrameComponent;
  let fixture: ComponentFixture<RhPageFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RhPageFrameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RhPageFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
