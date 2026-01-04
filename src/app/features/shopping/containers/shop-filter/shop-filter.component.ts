import { Component, OnInit } from '@angular/core';
import {
	UntypedFormControl,
	UntypedFormGroup,
	Validators,
	ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';

import { Category } from 'src/app/models/category.model';
import { Gender } from 'src/app/models/gender.model';
import { loadBikes } from 'src/app/store/actions/shopping-list.actions';
import { PanelComponent } from 'src/app/shared/components/panel/panel.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

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
	shopForm: UntypedFormGroup;
	categories: Category[];
	genders: Gender[];

	constructor(
		private activatedRoute: ActivatedRoute,
		private store: Store<{ shoppingList: any }>,
	) {}

	ngOnInit() {
		this.categories = this.activatedRoute.snapshot.data.categories;
		this.genders = this.activatedRoute.snapshot.data.genders;
		this.configureForm();
	}

	onSearch(event: any) {
		const query = this.shopForm.value;
		this.store.dispatch(loadBikes({ query }));
	}

	//#region Reactive Forms
	private configureForm(): void {
		this.shopForm = new UntypedFormGroup({
			categoryId: new UntypedFormControl(null),
			genderCode: new UntypedFormControl(null),
			price: new UntypedFormControl(
				null,
				Validators.pattern(/^\$?\d+((,\d{3})+)?(\.\d+)?$/),
			),
			gears: new UntypedFormControl(21, [Validators.min(0), Validators.max(36)]),
			frameSize: new UntypedFormControl(19, [
				Validators.min(13),
				Validators.max(24),
			]),
			rimSize: new UntypedFormControl(27.5, [
				Validators.min(12),
				Validators.max(29),
			]),
		});
	}
	//#endregion Reactive Forms
}
