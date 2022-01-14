import { createReducer, on } from '@ngrx/store';

import { ShopCart } from 'src/app/models/shopCart.model';
import { addToShopCart } from '../actions/shop-cart.actions';

const initialState = new ShopCart();

export const shopCartReducer = createReducer(
  initialState,
  // on(addToShopCart, (state, {purchase}) => ({
  //     ...state,
  //     purchases: [...state.purchases, purchase]
  // }))

  on(
    addToShopCart,
    (state, { purchase }) =>
      new ShopCart(
        state.id,
        state.purchaseDate,
        state.totalAmount,
        state.userId,
        state.addressId,
        [...state.purchases, purchase],
        state.user,
        state.address
      )
  )
);
