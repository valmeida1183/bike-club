import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ShopCart } from '../../models/shopCart.model';
import { Purchase } from '../../models/purchase.model';

@Injectable({
	providedIn: 'root',
})
export class ShopCartApiService {
	private http = inject(HttpClient);
	private shopCartsEndpointUrl = `${environment.baseApiUrl}/shop-carts`;

	getShopCartByUserId(userId: number): Observable<ShopCart> {
		return this.http.get<ShopCart>(`${this.shopCartsEndpointUrl}/${userId}`);
	}

	addPurchaseInCart(purchase: Purchase): Observable<ShopCart> {
		return this.http.post<ShopCart>(
			`${this.shopCartsEndpointUrl}/add-purchase`,
			purchase,
		);
	}

	// todo remove purchase from cart api service method

	removePurchaseFromCart(purchase: Purchase): Observable<ShopCart> {
		const { shopCartId, bikeId } = purchase;

		return this.http.delete<ShopCart>(
			`${this.shopCartsEndpointUrl}/remove-purchase/${shopCartId}/${bikeId}`,
		);
	}
}
