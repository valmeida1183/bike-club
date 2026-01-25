import {
	signalStore,
	withMethods,
	withProps,
	withState,
	patchState,
} from '@ngrx/signals';
import { ShoppingDetailsApiService } from '../services/shopping-details.api.service';
import { inject } from '@angular/core';
import { ShoppingDetailsState } from './shopping-details.state';

const initialState: ShoppingDetailsState = {
	bike: null,
};

export const ShoppingDetailsStore = signalStore(
	withState(initialState),
	withProps(() => ({
		shoppingDetailsApiService: inject(ShoppingDetailsApiService),
	})),
	withMethods((store) => {
		const { shoppingDetailsApiService } = store;

		return {
			getBike(id: number): void {
				shoppingDetailsApiService.getBike(id).subscribe({
					next: (response) => {
						patchState(store, { bike: response });
					},
				});
			},
		};
	}),
);
