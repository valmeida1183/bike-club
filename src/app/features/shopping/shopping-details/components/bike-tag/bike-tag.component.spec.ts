import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BikeTagComponent } from './bike-tag.component';

describe('BikeTagComponent', () => {
  let component: BikeTagComponent;
  let fixture: ComponentFixture<BikeTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BikeTagComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BikeTagComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
