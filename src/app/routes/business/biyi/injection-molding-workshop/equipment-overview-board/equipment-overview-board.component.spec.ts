import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentOverviewBoardComponent } from './equipment-overview-board.component';

describe('EquipmentOverviewBoardComponent', () => {
  let component: EquipmentOverviewBoardComponent;
  let fixture: ComponentFixture<EquipmentOverviewBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentOverviewBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentOverviewBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
