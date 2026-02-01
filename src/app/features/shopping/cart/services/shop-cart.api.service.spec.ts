import { TestBed } from '@angular/core/testing';

import { ShopCartApiService } from './shop-cart.api.service';

describe('ShopCartApiService', () => {
  let service: ShopCartApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShopCartApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
