import { FormControl, FormGroup } from '@angular/forms';

export type AddressForm = FormGroup<{
	street: FormControl<string | null>;
	complement: FormControl<string | null>;
	city: FormControl<string | null>;
	state: FormControl<string | null>;
	zipCode: FormControl<string | null>;
}>;
