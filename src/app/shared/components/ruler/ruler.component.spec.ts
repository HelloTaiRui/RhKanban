import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RhRulerComponent } from './ruler.component';

describe('RulerComponent', () => {
  let component: RhRulerComponent;
  let fixture: ComponentFixture<RhRulerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RhRulerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RhRulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
