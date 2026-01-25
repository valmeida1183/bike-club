import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingDetailsComponent } from './shopping-details.component';

describe('ShoppingDetailsComponent', () => {
  let component: ShoppingDetailsComponent;
  let fixture: ComponentFixture<ShoppingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShoppingDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShoppingDetailsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
