import { ShopCart } from 'src/app/models/shopCart.model';
import { CartState } from './cart.state';
import {
	patchState,
	signalStore,
	withComputed,
	withMethods,
	withState,
} from '@ngrx/signals';
import { Purchase } from 'src/app/models/purchase.model';
import { computed } from '@angular/core';

const initialState: CartState = {
	shopCart: new ShopCart(),
};

export const CartStore = signalStore(
	{ providedIn: 'root' },
	withState(initialState),
	withMethods((store) => {
		return {
			addPurchaseToCart(purchase: Purchase): void {
				const currentCart = store.shopCart();
				const updatedPurchases = [...currentCart.purchases, purchase];
				const updatedCart = new ShopCart(
					currentCart.id,
					currentCart.purchaseDate,
					currentCart.totalAmount,
					currentCart.userId,
					currentCart.addressId,
					updatedPurchases,
					currentCart.user,
					currentCart.address,
				);

				patchState(store, { shopCart: updatedCart });
			},

			setShopCart(shopCart: ShopCart | null): void {
				patchState(store, { shopCart });
			},
		};
	}),
	withComputed((store) => ({
		cartCounter: computed(() => {
			return store
				.shopCart()
				.purchases.reduce((total, purchase) => total + purchase.quantity, 0);
		}),
	})),
);
