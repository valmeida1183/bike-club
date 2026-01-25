import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BikeDescriptionPanelComponent } from './bike-description-panel.component';

describe('BikeDescriptionPanelComponent', () => {
	let component: BikeDescriptionPanelComponent;
	let fixture: ComponentFixture<BikeDescriptionPanelComponent>;
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [BikeDescriptionPanelComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(BikeDescriptionPanelComponent);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
