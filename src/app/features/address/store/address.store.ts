import {
	patchState,
	signalStore,
	withHooks,
	withMethods,
	withProps,
	withState,
} from '@ngrx/signals';
import { AddressState } from './address.state';
import { inject } from '@angular/core';
import { AddressApiService } from '../services/address.api.service';

const initialState: AddressState = {
	addressStates: [],
	addressCities: [],
};

export const AddressStore = signalStore(
	withState(initialState),
	withProps(() => ({ addressApiService: inject(AddressApiService) })),
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
		};
	}),
	withHooks({
		onInit(store) {
			store.getStates();
		},
	}),
);
