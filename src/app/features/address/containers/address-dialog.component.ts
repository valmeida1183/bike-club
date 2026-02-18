import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { MatButtonModule } from '@angular/material/button';
import {
	MAT_DIALOG_DATA,
	MatDialogModule,
	MatDialogRef,
} from '@angular/material/dialog';
import { Address } from 'src/app/shared/models/address.model';
import { AddressForm } from '../models/address-form.type';
import { AddressDialogData } from '../models/adress-dialog-data.model';
import { AddressStore } from '../store/address.store';
import { MatInputModule } from '@angular/material/input';

@Component({
	selector: 'bc-address-dialog',
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatSelectModule,
		MatDialogModule,
		MatButtonModule,
		MatInputModule,
	],
	templateUrl: './address-dialog.component.html',
	styleUrl: './address-dialog.component.scss',
	standalone: true,
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
		this.loadAddress();

		console.log(this.addressStates());
	}

	onCancel(): void {
		this.dialogRef.close();
	}

	onSaveAddress(): void {
		const address: Address = this.addressForm.getRawValue();

		// Store will handle whether to add or update the address based on the presence of an ID
		// in afterClosed subscription in the cart component
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

	private loadAddress(): void {
		const { address = null } = this.data;

		if (address) {
			this.store.setAddress(address);

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
