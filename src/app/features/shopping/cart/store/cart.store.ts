import { computed, inject } from '@angular/core';
import {
	patchState,
	signalStore,
	withComputed,
	withMethods,
	withProps,
	withState,
} from '@ngrx/signals';
import { Bike } from 'src/app/features/shopping/models/bike.model';
import { Purchase } from 'src/app/features/shopping/models/purchase.model';
import { ShopCart } from 'src/app/features/shopping/models/shopCart.model';
import { ShopCartApiService } from '../services/shop-cart.api.service';
import { CartState } from './cart.state';

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
				const { shopCartApiService } = store;
				const currentCart = store.shopCart();

				if (!currentCart) {
					return;
				}

				const purchase = this._createPurchase(bike, quantity, currentCart.id);

				shopCartApiService.addPurchaseInCart(purchase).subscribe({
					next: (response: ShopCart) => {
						patchState(store, { shopCart: response });
					},
				});
			},

			removePurchaseFromCart(purchase: Purchase): void {
				const { shopCartApiService } = store;
				const currentCart = store.shopCart();

				if (!currentCart) {
					return;
				}

				shopCartApiService.removePurchaseFromCart(purchase).subscribe({
					next: (response: ShopCart) => {
						patchState(store, { shopCart: response });
					},
				});
			},

			getCartByUserId(userId: number): void {
				const { shopCartApiService } = store;

				shopCartApiService.getShopCartByUserId(userId).subscribe({
					next: (response: ShopCart) => {
						patchState(store, { shopCart: response });
					},
				});
			},

			_createPurchase(bike: Bike, quantity: number, shopCartId: number): Purchase {
				const purchase = new Purchase();

				purchase.shopCartId = shopCartId;
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
