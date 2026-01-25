import { Component, OnInit, inject, input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { CartStore } from 'src/app/core/cart/store/cart.store';
import { Bike } from 'src/app/features/shopping/models/bike.model';
import { Purchase } from 'src/app/features/shopping/models/purchase.model';
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
	private router = inject(Router);

	bike = input<Bike>(undefined);

	imagePath: string;

	ngOnInit(): void {
		this.imagePath = `${environment.imageResource}${this.bike().image}`;
	}

	onDetails(): void {
		const bike = this.bike();
		this.router.navigate(['/shopping/details', bike.id]);
	}

	onAddToCart(): void {
		const purchase = new Purchase();
		purchase.bike = this.bike();
		purchase.bikeId = this.bike().id;
		purchase.quantity = 1;

		this.cartStore.addPurchaseToCart(purchase);
	}
}
