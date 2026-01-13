import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopOperatingBoardComponent } from './workshop-operating-board.component';

describe('WorkshopOperatingBoardComponent', () => {
  let component: WorkshopOperatingBoardComponent;
  let fixture: ComponentFixture<WorkshopOperatingBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkshopOperatingBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopOperatingBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
