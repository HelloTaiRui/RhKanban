import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartOperationComponent } from './smart-operation.component';

describe('SmartOperationComponent', () => {
  let component: SmartOperationComponent;
  let fixture: ComponentFixture<SmartOperationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartOperationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
