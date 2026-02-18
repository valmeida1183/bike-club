import { CurrencyPipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { ShopCart } from '../../../models/shopCart.model';
import { Address } from 'src/app/shared/models/address.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'bc-cart-summary',
	imports: [CurrencyPipe, MatButtonModule],
	templateUrl: './cart-summary.component.html',
	styleUrl: './cart-summary.component.scss',
})
export class CartSummaryComponent {
	shopCart = input<ShopCart>(null);
	openAddressDialog = output<Address | null>();
	buyNow = output<void>();

	address = computed(() => this.shopCart()?.address);
	totalAmount = computed(() => this.shopCart()?.totalAmount);
	isBuyNowDisabled = computed(() => {
		const cart = this.shopCart();

		return !cart.address || cart.purchases.length === 0;
	});

	onOpenAddressDialog(): void {
		this.openAddressDialog.emit(this.address());
	}

	onBuyNow(): void {
		console.log('Buy now clicked');
		this.buyNow.emit();
	}
}
