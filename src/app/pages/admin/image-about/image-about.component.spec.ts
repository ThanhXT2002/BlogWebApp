import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageAboutComponent } from './image-about.component';

describe('ImageAboutComponent', () => {
  let component: ImageAboutComponent;
  let fixture: ComponentFixture<ImageAboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageAboutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImageAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
