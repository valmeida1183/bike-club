import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BikeImagePanelComponent } from './bike-image-panel.component';

describe('BikeImagePanelComponent', () => {
  let component: BikeImagePanelComponent;
  let fixture: ComponentFixture<BikeImagePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BikeImagePanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BikeImagePanelComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
