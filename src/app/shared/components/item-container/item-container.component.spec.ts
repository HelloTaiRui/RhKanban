import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RhItemContainerComponent } from './item-container.component';

describe('ItemContainerComponent', () => {
  let component: RhItemContainerComponent;
  let fixture: ComponentFixture<RhItemContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RhItemContainerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RhItemContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
