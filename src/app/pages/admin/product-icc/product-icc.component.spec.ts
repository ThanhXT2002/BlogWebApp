import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductIccComponent } from './product-icc.component';

describe('ProductIccComponent', () => {
  let component: ProductIccComponent;
  let fixture: ComponentFixture<ProductIccComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductIccComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductIccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
