import {
	patchState,
	signalStore,
	withMethods,
	withProps,
	withState,
} from '@ngrx/signals';
import { ShopState } from './shop.state';
import { inject } from '@angular/core';
import { ShopApiService } from '../services/shop.api.service';
import { BikeSearchFilter } from '../models/bike-search-filter';
import { Bike } from 'src/app/models/bike.model';

const initialState: ShopState = {
	bikes: [],
};

export const ShopStore = signalStore(
	withState(initialState),
	withProps(() => ({ shopApiService: inject(ShopApiService) })),
	withMethods((store) => {
		const { shopApiService } = store;

		return {
			getBikes(filter: BikeSearchFilter): void {
				shopApiService.getBikes(filter).subscribe({
					next: (response: Bike[]) => {
						patchState(store, { bikes: response });
					},
				});
			},
		};
	}),
);
