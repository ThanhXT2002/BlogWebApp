import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormProductIccComponent } from './form-product-icc.component';

describe('FormProductIccComponent', () => {
  let component: FormProductIccComponent;
  let fixture: ComponentFixture<FormProductIccComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormProductIccComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormProductIccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
