import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductLineBoardComponent } from './product-line-board.component';

describe('ProductLineBoardComponent', () => {
  let component: ProductLineBoardComponent;
  let fixture: ComponentFixture<ProductLineBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductLineBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductLineBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
