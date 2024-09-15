import { TestBed } from '@angular/core/testing';

import { ProductIccService } from './product-icc.service';

describe('ProductIccService', () => {
  let service: ProductIccService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductIccService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
