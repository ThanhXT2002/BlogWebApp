import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPostCategoryComponent } from './form-post-category.component';

describe('FormPostCategoryComponent', () => {
  let component: FormPostCategoryComponent;
  let fixture: ComponentFixture<FormPostCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPostCategoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormPostCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
