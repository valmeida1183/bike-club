import { createReducer, on } from '@ngrx/store';

import { ShopCart } from 'src/app/models/shopCart.model';
import { addToShopCart } from '../actions/shop-cart.actions';

const initialState = new ShopCart();

export const shopCartReducer = createReducer(initialState,
    on(addToShopCart, (state, {purchase}) => ({
        ...state,
        purchases: [...state.purchases, purchase]
    }))
);
