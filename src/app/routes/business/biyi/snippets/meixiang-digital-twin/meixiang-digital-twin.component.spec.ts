import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RhMeixiangDigitalTwinComponent } from './meixiang-digital-twin.component';

describe('MeixiangDigitalTwinComponent', () => {
  let component: RhMeixiangDigitalTwinComponent;
  let fixture: ComponentFixture<RhMeixiangDigitalTwinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RhMeixiangDigitalTwinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RhMeixiangDigitalTwinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
