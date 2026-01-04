import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShoppFilterComponent } from './shop-filter.component';

describe('ShoppFilterComponent', () => {
	let component: ShoppFilterComponent;
	let fixture: ComponentFixture<ShoppFilterComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ShoppFilterComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ShoppFilterComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
