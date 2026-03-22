import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { environment } from 'src/environments/environment';
import { Purchase } from '../../../models/purchase.model';
import { IncrementComponent } from 'src/app/shared/components/increment/increment.component';
import { CartStore } from '../../store/cart.store';
import { MatIcon } from '@angular/material/icon';

@Component({
	selector: 'bc-cart-item',
	imports: [CurrencyPipe, MatButtonModule, IncrementComponent, MatIcon],
	templateUrl: './cart-item.component.html',
	styleUrl: './cart-item.component.scss',
})
export class CartItemComponent {
	store = inject(CartStore);

	purchase = input.required<Purchase>();

	bike = computed(() => this.purchase().bike);
	imagePath = computed(
		() => `${environment.imageResource}${this.bike()?.image}`,
	);
	totalPrice = computed(() => this.purchase().quantity * this.bike()?.price);

	onChangeQuantity(newQuantity: number): void {
		const bikeId = this.purchase().bikeId;
		this.store.updateQuantityPurchaseInCart(bikeId, newQuantity);
	}

	onRemove(): void {
		const purchase = this.purchase();
		this.store.removePurchaseFromCart(purchase);
	}
}
