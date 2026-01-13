import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartMarketingComponent } from './smart-marketing.component';

describe('SmartMarketingComponent', () => {
  let component: SmartMarketingComponent;
  let fixture: ComponentFixture<SmartMarketingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartMarketingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartMarketingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
