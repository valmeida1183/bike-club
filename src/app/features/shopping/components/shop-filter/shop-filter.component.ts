import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Category } from 'src/app/models/category.model';
import { Gender } from 'src/app/models/gender.model';
import { PanelComponent } from 'src/app/shared/components/panel/panel.component';
import { BikeSearchFilter } from '../../models/bike-search-filter';
import { ShopFilterForm } from '../../models/shop-filter-form';

@Component({
	selector: 'bc-shop-filter',
	templateUrl: './shop-filter.component.html',
	styleUrls: ['./shop-filter.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		PanelComponent,
		MatFormFieldModule,
		MatSelectModule,
		MatInputModule,
	],
})
export class ShoppFilterComponent implements OnInit {
	private fb = inject(FormBuilder);
	protected shopForm: ShopFilterForm;

	categories = input<Category[]>([]);
	genders = input<Gender[]>([]);
	search = output<BikeSearchFilter>();

	get price() {
		return this.shopForm.get('price');
	}

	get gears() {
		return this.shopForm.get('gears');
	}

	get frameSize() {
		return this.shopForm.get('frameSize');
	}

	get rimSize() {
		return this.shopForm.get('rimSize');
	}

	ngOnInit(): void {
		this.configureForm();
	}

	onSearch(): void {
		const filter: BikeSearchFilter = this.shopForm.getRawValue();
		this.search.emit(filter);
	}

	private configureForm(): void {
		this.shopForm = this.fb.group({
			categoryId: this.fb.control<number | null>(null),
			genderCode: this.fb.control<string | null>(null),
			price: this.fb.control<number | null>(null, {
				validators: [Validators.pattern(/^\$?\d+((,\d{3})+)?(\.\d+)?$/)],
			}),
			gears: this.fb.control<number | null>(null, {
				validators: [Validators.min(0), Validators.max(36)],
			}),
			frameSize: this.fb.control<number | null>(null, {
				validators: [Validators.min(13), Validators.max(24)],
			}),
			rimSize: this.fb.control<number | null>(null, {
				validators: [Validators.min(12), Validators.max(29)],
			}),
		});
	}
}
