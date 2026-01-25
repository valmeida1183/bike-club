import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BikeItemDescriptionComponent } from './bike-item-description.component';

describe('BikeItemDescriptionComponent', () => {
  let component: BikeItemDescriptionComponent;
  let fixture: ComponentFixture<BikeItemDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BikeItemDescriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BikeItemDescriptionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
