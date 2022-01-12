import { createAction, props } from '@ngrx/store';
import { Bike } from 'src/app/models/bike.model';
import { Purchase } from 'src/app/models/purchase.model';

export const addToShopCart = createAction('[Shop Cart] Add to Shop Cart', props<{purchase: Purchase}>());
