import { CurrencyPipe } from '@angular/common';
import { Component, computed, input, OnInit, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ShopCart } from '../../../models/shopCart.model';

@Component({
	selector: 'bc-cart-summary',
	imports: [CurrencyPipe, MatButtonModule],
	templateUrl: './cart-summary.component.html',
	styleUrl: './cart-summary.component.scss',
})
export class CartSummaryComponent implements OnInit {
	shopCart = input<ShopCart>(null);
	openAddressDialog = output<void>();
	buyNow = output<void>();

	address = computed(() => this.shopCart()?.address);
	totalAmount = computed(() => this.shopCart()?.totalAmount);
	isBuyNowDisabled = computed(() => {
		const cart = this.shopCart();

		return !cart.address || cart.purchases.length === 0;
	});

	ngOnInit(): void {
		console.log(
			'CartSummaryComponent initialized with shopCart:',
			this.shopCart(),
		);
	}

	onOpenAddressDialog(): void {
		this.openAddressDialog.emit();
	}

	onBuyNow(): void {
		console.log('Buy now clicked');
		this.buyNow.emit();
	}
}
