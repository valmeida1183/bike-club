import { TestBed } from '@angular/core/testing';

import { ShoppingDetailsApiService } from './shopping-details.api.service';

describe('ShoppingDetailsApiService', () => {
  let service: ShoppingDetailsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShoppingDetailsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
