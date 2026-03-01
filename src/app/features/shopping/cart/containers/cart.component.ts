import { Component, inject, Injector } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AddressDialogComponent } from 'src/app/features/address/containers/address-dialog.component';
import { AddressApiService } from 'src/app/features/address/services/address.api.service';
import { AddressStore } from 'src/app/features/address/store/address.store';
import { TitleComponent } from 'src/app/shared/components/title/title.component';
import { Address } from 'src/app/shared/models/address.model';
import { CartSummaryComponent } from '../components/cart-summary/cart-summary.component';
import { CartStore } from '../store/cart.store';
import { CartItemComponent } from '../components/cart-item/cart-item.component';

@Component({
	selector: 'bc-cart',
	imports: [TitleComponent, CartSummaryComponent, CartItemComponent],
	templateUrl: './cart.component.html',
	styleUrl: './cart.component.scss',
	providers: [AddressStore, AddressApiService],
})
export class CartComponent {
	store = inject(CartStore);
	addressStore = inject(AddressStore);
	injectorContext = inject(Injector);

	dialogRef: MatDialogRef<AddressDialogComponent, Address>;

	onOpenAddressDialog(): void {
		const { address: currentAddress } = this.store.shopCart();

		this.dialogRef = this.addressStore.openAddressDialog(currentAddress);

		this.dialogRef.afterClosed().subscribe({
			next: (address: Address | null) => {
				if (address) {
					this.store.updateCartAddress(address);
				}
			},
		});
	}

	onBuyNow(): void {
		// Implement the logic to handle the buy now action
	}
}
