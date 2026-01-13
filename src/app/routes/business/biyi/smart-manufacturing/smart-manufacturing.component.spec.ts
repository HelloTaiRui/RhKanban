import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartManufacturingComponent } from './smart-manufacturing.component';

describe('SmartManufacturingComponent', () => {
  let component: SmartManufacturingComponent;
  let fixture: ComponentFixture<SmartManufacturingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartManufacturingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartManufacturingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
