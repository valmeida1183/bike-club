import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShoppingComponent } from './shopping.component';

describe('ShoppingComponent', () => {
  let component: ShoppingComponent;
  let fixture: ComponentFixture<ShoppingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoppingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
