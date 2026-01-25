import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BikePricePanelComponent } from './bike-price-panel.component';

describe('BikePricePanelComponent', () => {
	let component: BikePricePanelComponent;
	let fixture: ComponentFixture<BikePricePanelComponent>;
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [BikePricePanelComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(BikePricePanelComponent);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
