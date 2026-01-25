import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BikePriceComponent } from './bike-price.component';

describe('BikePriceComponent', () => {
  let component: BikePriceComponent;
  let fixture: ComponentFixture<BikePriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BikePriceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BikePriceComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
