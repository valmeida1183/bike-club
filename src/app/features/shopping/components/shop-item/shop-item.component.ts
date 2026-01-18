import { Component, OnInit, inject, input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CartStore } from 'src/app/core/cart/store/cart.store';
import { Bike } from 'src/app/models/bike.model';
import { Purchase } from 'src/app/models/purchase.model';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'bc-shop-item',
	templateUrl: './shop-item.component.html',
	styleUrls: ['./shop-item.component.scss'],
	standalone: true,
	imports: [CommonModule, MatCardModule, MatButtonModule],
})
export class ShopItemComponent implements OnInit {
	private cartStore = inject(CartStore);

	bike = input<Bike>(undefined);

	imagePath: string;

	ngOnInit(): void {
		this.imagePath = `${environment.imageResource}${this.bike().image}`;
	}

	onDetails(): void {}

	onAddToCart(): void {
		const purchase = new Purchase();
		purchase.bike = this.bike();
		purchase.bikeId = this.bike().id;
		purchase.quantity = 1;

		this.cartStore.addPurchaseToCart(purchase);
	}
}
