import {
	patchState,
	signalStore,
	withHooks,
	withMethods,
	withProps,
	withState,
} from '@ngrx/signals';
import { AddressState } from './address.state';
import { inject, Injector } from '@angular/core';
import { AddressApiService } from '../services/address.api.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Address } from 'src/app/shared/models/address.model';
import { AddressDialogData } from '../models/adress-dialog-data.model';
import { AddressDialogComponent } from '../containers/address-dialog.component';
import { Observable, of, switchMap } from 'rxjs';

const initialState: AddressState = {
	address: null,
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

			setAddress(address: Address): void {
				patchState(store, { address: address });
			},

			openAddressDialog(address?: Address): void {
				const { matDialogService } = store;
				const title = address ? 'Edit Address' : 'Add Address';

				const dialogConfig: MatDialogConfig<AddressDialogData> = {
					width: '700px',
					disableClose: true,
					data: {
						title: title,
						address: address ? address : null,
					},
					injector: store.injectorContext,
				};

				const dialogRef = matDialogService.open<AddressDialogComponent>(
					AddressDialogComponent,
					dialogConfig,
				);

				dialogRef
					.afterClosed()
					.pipe(
						switchMap((address: Address | undefined) => {
							if (address) {
								return this._saveAddress(address);
							}

							return of(null);
						}),
					)
					.subscribe({
						next: (address: Address | null) => {
							if (address) {
								patchState(store, { address: address });
							}
						},
					});
			},

			_saveAddress(newAddress: Address): Observable<Address> {
				const currentAddress = this.store.address();

				if (currentAddress) {
					newAddress.id = currentAddress.id;
					return addressApiService.updateAddress(newAddress);
				} else {
					return addressApiService.addAddress(newAddress);
				}
			},
		};
	}),
	withHooks({
		onInit(store) {
			store.getStates();
		},
	}),
);
