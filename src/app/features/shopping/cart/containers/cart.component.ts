import { Component, inject } from '@angular/core';
import { TitleComponent } from 'src/app/shared/components/title/title.component';
import { CartSummaryComponent } from '../components/cart-summary/cart-summary.component';
import { CartStore } from '../store/cart.store';
import { AddressStore } from 'src/app/features/address/store/address.store';
import { AddressApiService } from 'src/app/features/address/services/address.api.service';

@Component({
	selector: 'bc-cart',
	imports: [TitleComponent, CartSummaryComponent],
	templateUrl: './cart.component.html',
	styleUrl: './cart.component.scss',
	providers: [AddressStore, AddressApiService],
})
export class CartComponent {
	store = inject(CartStore);
	addressStore = inject(AddressStore);

	onOpenAddressDialog(): void {
		this.addressStore.openAddressDialog();
	}

	onBuyNow(): void {
		// Implement the logic to handle the buy now action
	}
}
