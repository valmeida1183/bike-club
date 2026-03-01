import { CurrencyPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { environment } from 'src/environments/environment';
import { Purchase } from '../../../models/purchase.model';

@Component({
	selector: 'bc-cart-item',
	imports: [CurrencyPipe, MatButtonModule],
	templateUrl: './cart-item.component.html',
	styleUrl: './cart-item.component.scss',
})
export class CartItemComponent {
	purchase = input.required<Purchase>();

	bike = computed(() => this.purchase().bike);
	imagePath = computed(
		() => `${environment.imageResource}${this.bike()?.image}`,
	);
	totalPrice = computed(() => this.purchase().quantity * this.bike()?.price);
}
