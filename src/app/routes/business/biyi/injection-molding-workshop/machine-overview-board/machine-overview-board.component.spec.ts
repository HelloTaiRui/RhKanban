import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineOverviewBoardComponent } from './machine-overview-board.component';

describe('MachineOverviewBoardComponent', () => {
  let component: MachineOverviewBoardComponent;
  let fixture: ComponentFixture<MachineOverviewBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineOverviewBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineOverviewBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
