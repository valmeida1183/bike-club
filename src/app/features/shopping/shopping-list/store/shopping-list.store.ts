import {
	patchState,
	signalStore,
	withMethods,
	withProps,
	withState,
} from '@ngrx/signals';
import { ShoppingListState } from './shopping-list.state';
import { inject } from '@angular/core';
import { ShoppingListApiService } from '../services/shopping-list.api.service';
import { BikeSearchFilter } from '../models/bike-search-filter';
import { Bike } from 'src/app/features/shopping/models/bike.model';

const initialState: ShoppingListState = {
	bikes: [],
};

export const ShoppingListStore = signalStore(
	withState(initialState),
	withProps(() => ({ shoppingListApiService: inject(ShoppingListApiService) })),
	withMethods((store) => {
		const { shoppingListApiService } = store;

		return {
			getBikes(filter: BikeSearchFilter): void {
				shoppingListApiService.getBikes(filter).subscribe({
					next: (response: Bike[]) => {
						patchState(store, { bikes: response });
					},
				});
			},
		};
	}),
);
