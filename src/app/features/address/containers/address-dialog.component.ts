import {
	Component,
	effect,
	inject,
	input,
	OnInit,
	output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import {
	MAT_DIALOG_DATA,
	MatDialogModule,
	MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AddressForm } from '../models/address-form.type';
import { AddressDialogData } from '../models/adress-dialog-data.model';
import { AddressStore } from '../store/address.store';
import { Address } from 'src/app/shared/models/address.model';

@Component({
	selector: 'bc-address-dialog',
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatSelectModule,
		MatDialogModule,
		MatButtonModule,
	],
	templateUrl: './address-dialog.component.html',
	styleUrl: './address-dialog.component.scss',
})
export class AddressDialogComponent implements OnInit {
	private fb = inject(FormBuilder);
	private store = inject(AddressStore);
	private dialogRef = inject(MatDialogRef<AddressDialogComponent>);
	private data = inject<AddressDialogData>(MAT_DIALOG_DATA);

	protected addressForm: AddressForm;
	protected readonly addressStates = this.store.addressStates;
	protected readonly addressCities = this.store.addressCities;
	protected readonly title = this.data.title;

	get state() {
		return this.addressForm.get('state');
	}

	get city() {
		return this.addressForm.get('city');
	}

	get street() {
		return this.addressForm.get('street');
	}

	get complement() {
		return this.addressForm.get('complement');
	}

	get zipCode() {
		return this.addressForm.get('zipCode');
	}

	ngOnInit(): void {
		this.configureForm();
		this.loadAddressToForm();
	}

	onCancel(): void {
		this.dialogRef.close();
	}

	onSaveAddress(): void {
		const address: Address = this.addressForm.getRawValue();

		this.dialogRef.close(address);
	}

	onStateChange(stateCode: string): void {
		this.city?.reset();
		this.store.getCities(stateCode);
	}

	private configureForm(): void {
		this.addressForm = this.fb.group({
			state: this.fb.control<string | null>(null, {
				validators: [Validators.required],
			}),
			city: this.fb.control<string | null>(null, {
				validators: [Validators.required, Validators.maxLength(30)],
			}),
			street: this.fb.control<string | null>(null, {
				validators: [Validators.required, Validators.maxLength(50)],
			}),
			complement: this.fb.control<string | null>(null, {
				validators: [Validators.required, Validators.maxLength(50)],
			}),
			zipCode: this.fb.control<string | null>(null, {
				validators: [
					Validators.required,
					Validators.maxLength(8),
					Validators.pattern(/^[0-9]*$/),
				],
			}),
		});
	}

	private loadAddressToForm(): void {
		const address = this.data.address;
		if (address) {
			this.addressForm.patchValue({
				state: address.state,
				city: address.city,
				street: address.street,
				complement: address.complement,
				zipCode: address.zipCode,
			});
		}
	}
}
