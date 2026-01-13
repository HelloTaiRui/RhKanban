import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RhvFormlyTextareaComponent } from './textarea.component';

describe('RhvFormlyTextareaComponent', () => {
  let component: RhvFormlyTextareaComponent;
  let fixture: ComponentFixture<RhvFormlyTextareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RhvFormlyTextareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RhvFormlyTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
