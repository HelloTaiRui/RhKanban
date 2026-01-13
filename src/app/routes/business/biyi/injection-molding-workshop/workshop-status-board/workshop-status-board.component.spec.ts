import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopStatusBoardComponent } from './workshop-status-board.component';

describe('WorkshopStatusBoardComponent', () => {
  let component: WorkshopStatusBoardComponent;
  let fixture: ComponentFixture<WorkshopStatusBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkshopStatusBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopStatusBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
