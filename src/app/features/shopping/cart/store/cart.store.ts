import { ShopCart } from 'src/app/features/shopping/models/shopCart.model';
import { CartState } from './cart.state';
import {
	patchState,
	signalStore,
	withComputed,
	withMethods,
	withState,
} from '@ngrx/signals';
import { Purchase } from 'src/app/features/shopping/models/purchase.model';
import { computed } from '@angular/core';
import { Bike } from 'src/app/features/shopping/models/bike.model';

const initialState: CartState = {
	shopCart: new ShopCart(),
};

export const CartStore = signalStore(
	{ providedIn: 'root' },
	withState(initialState),
	withMethods((store) => {
		return {
			addPurchaseToCart(bike: Bike, quantity: number): void {
				const currentCart = store.shopCart();
				const purchase = this._createPruchase(bike, quantity, currentCart.id);

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

				// Todo: Persist the cart to backend.
			},

			// Todo: Implement removePurchaseFromCart method.
			// Todo: Implement loadCart from backend method and use on inInit hook of store.

			_createPruchase(bike: Bike, quantity: number, shopCartId: number): Purchase {
				const purchase = new Purchase();

				purchase.shopCartId = shopCartId;
				purchase.bike = bike;
				purchase.bikeId = bike.id;
				purchase.quantity = quantity;

				return purchase;
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
