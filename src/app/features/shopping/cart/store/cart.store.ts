import { ShopCart } from 'src/app/features/shopping/models/shopCart.model';
import { CartState } from './cart.state';
import {
	patchState,
	signalStore,
	withComputed,
	withHooks,
	withMethods,
	withProps,
	withState,
} from '@ngrx/signals';
import { Purchase } from 'src/app/features/shopping/models/purchase.model';
import { computed, inject } from '@angular/core';
import { Bike } from 'src/app/features/shopping/models/bike.model';
import { ShopCartApiService } from '../services/shop-cart.api.service';
import { get } from 'http';

const initialState: CartState = {
	shopCart: new ShopCart(),
};

export const CartStore = signalStore(
	{ providedIn: 'root' },
	withState(initialState),
	withProps(() => ({ shopCartApiService: inject(ShopCartApiService) })),
	withMethods((store) => {
		return {
			addPurchaseToCart(bike: Bike, quantity: number): void {
				const currentCart = store.shopCart();
				const purchase = this._createPruchase(bike, quantity, currentCart.id);
				const newTotalAmount = this._calculateTotalAmount(
					purchase,
					currentCart.totalAmount,
				);
				const updatedPurchases = [...currentCart.purchases, purchase];

				const updatedCart = new ShopCart(
					currentCart.id,
					currentCart.purchaseDate,
					newTotalAmount,
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
			// Todo: Implement loadCart from backend method and use.
			getCartByUserId(userId: number): void {
				const { shopCartApiService } = store;

				shopCartApiService.getShopCartByUserId(userId).subscribe({
					next: (response: ShopCart) => {
						patchState(store, { shopCart: response });
					},
				});
			},

			_calculateTotalAmount(purchase: Purchase, currentTotal: number): number {
				return currentTotal + purchase.bike.price * purchase.quantity;
			},

			_createPurchase(bike: Bike, quantity: number, shopCartId: number): Purchase {
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
