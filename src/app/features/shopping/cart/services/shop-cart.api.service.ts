import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ShopCart } from '../../models/shopCart.model';

@Injectable({
	providedIn: 'root',
})
export class ShopCartApiService {
	private http = inject(HttpClient);
	private shopCartsEndpointUrl = `${environment.baseApiUrl}/shop-carts`;

	getShopCartByUserId(userId: number): Observable<ShopCart> {
		return this.http.get<ShopCart>(`${this.shopCartsEndpointUrl}/${userId}`);
	}

	updateShopCart(shopCart: ShopCart): Observable<ShopCart> {
		return this.http.put<ShopCart>(
			`${this.shopCartsEndpointUrl}/${shopCart.id}`,
			shopCart,
		);
	}
}
