import { inject, Injector } from '@angular/core';
import {
	MatDialog,
	MatDialogConfig,
	MatDialogRef,
} from '@angular/material/dialog';
import {
	patchState,
	signalStore,
	withHooks,
	withMethods,
	withProps,
	withState,
} from '@ngrx/signals';
import { Address } from 'src/app/shared/models/address.model';
import { AddressDialogComponent } from '../containers/address-dialog.component';
import { AddressDialogData } from '../models/adress-dialog-data.model';
import { AddressApiService } from '../services/address.api.service';
import { AddressState } from './address.state';

const initialState: AddressState = {
	addressStates: [],
	addressCities: [],
};

export const AddressStore = signalStore(
	withState(initialState),
	withProps(() => ({
		addressApiService: inject(AddressApiService),
		matDialogService: inject(MatDialog),
		injectorContext: inject(Injector),
	})),
	withMethods((store) => {
		const { addressApiService } = store;

		return {
			getStates(): void {
				addressApiService.getStates().subscribe({
					next: (response) => {
						patchState(store, { addressStates: response });
					},
				});
			},

			getCities(stateCode: string): void {
				addressApiService.getCities(stateCode).subscribe({
					next: (response) => {
						patchState(store, { addressCities: response });
					},
				});
			},

			openAddressDialog(
				address?: Address,
			): MatDialogRef<AddressDialogComponent, Address> {
				const { matDialogService } = store;
				const title = address ? 'Edit Address' : 'Add Address';

				const dialogConfig: MatDialogConfig<AddressDialogData> = {
					width: '700px',
					disableClose: true,
					data: {
						title: title,
						address: address ? address : null,
					},
					// Pass the injector context to the dialog then it can inject the AddressStore and knowing who is providing it (AddressStore)
					// and avoid creating a new instance of the store in the dialog component
					injector: store.injectorContext,
				};

				const dialogRef = matDialogService.open<
					AddressDialogComponent,
					AddressDialogData,
					Address
				>(AddressDialogComponent, dialogConfig);

				return dialogRef;
			},
		};
	}),
	withHooks({
		onInit(store) {
			store.getStates();
		},
	}),
);
