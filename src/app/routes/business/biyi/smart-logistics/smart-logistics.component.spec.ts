import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartLogisticsComponent } from './smart-logistics.component';

describe('SmartLogisticsComponent', () => {
  let component: SmartLogisticsComponent;
  let fixture: ComponentFixture<SmartLogisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartLogisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartLogisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
