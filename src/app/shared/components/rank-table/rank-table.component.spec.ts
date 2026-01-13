import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RhRankTableComponent } from './rank-table.component';

describe('RankTableComponent', () => {
  let component: RhRankTableComponent;
  let fixture: ComponentFixture<RhRankTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RhRankTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RhRankTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
