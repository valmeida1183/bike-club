import { FormControl, FormGroup } from '@angular/forms';

export type ShopFilterForm = FormGroup<{
	categoryId: FormControl<number | null>;
	genderCode: FormControl<string | null>;
	price: FormControl<number | null>;
	gears: FormControl<number | null>;
	frameSize: FormControl<number | null>;
	rimSize: FormControl<number | null>;
}>;
