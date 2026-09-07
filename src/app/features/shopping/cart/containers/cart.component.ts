import { Component, effect, inject, Injector } from '@angular/core';
import { LayoutStore } from 'src/app/core/layout/store/layout.store';
import { AddressApiService } from 'src/app/features/address/services/address.api.service';
import { AddressStore } from 'src/app/features/address/store/address.store';
import { PaymentApiService } from 'src/app/features/payment/services/payment.api.service';
import { PaymentStore } from 'src/app/features/payment/store/payment.store';
import { TitleComponent } from 'src/app/shared/components/title/title.component';
import { DialogTypeEnum } from 'src/app/shared/enums/dialog-type.enum';
import { Address } from 'src/app/shared/models/address.model';
import { CartItemComponent } from '../components/cart-item/cart-item.component';
import { CartSummaryComponent } from '../components/cart-summary/cart-summary.component';
import { CartStore } from '../store/cart.store';

@Component({
	selector: 'bc-cart',
	imports: [TitleComponent, CartSummaryComponent, CartItemComponent],
	templateUrl: './cart.component.html',
	styleUrl: './cart.component.scss',
	providers: [AddressStore, PaymentStore, AddressApiService, PaymentApiService],
})
export class CartComponent {
	store = inject(CartStore);
	addressStore = inject(AddressStore);
	paymentStore = inject(PaymentStore);
	injectorContext = inject(Injector);
	layoutStore = inject(LayoutStore);

	constructor() {
		effect((onCleanup) => {
			const paymentIntent = this.paymentStore.paymentIntent();

			if (!paymentIntent) {
				return;
			}

			const paymentDialogRef = this.paymentStore.openPaymentDialog('Payment');
			const subscription = paymentDialogRef.afterClosed().subscribe({
				next: (paymentIntentId: string | undefined) => {
					if (paymentIntentId) {
						this.layoutStore.openMessageDialog(
							DialogTypeEnum.SUCCESS,
							'Payment Successful',
							`Your Payment order was successful. When the order is shipped, you will receive a confirmation email with the tracking number.`,
						);
					}
				},
			});

			onCleanup(() => {
				subscription.unsubscribe();
			});
		});
	}

	onOpenAddressDialog(): void {
		const shopCart = this.store.shopCart();
		const currentAddress = shopCart ? shopCart.address! : undefined;

		const addressDialogRef = this.addressStore.openAddressDialog(currentAddress);

		addressDialogRef.afterClosed().subscribe({
			next: (address: Address | undefined) => {
				if (address) {
					this.store.updateCartAddress(address);
				}
			},
		});
	}

	onBuyNow(): void {
		const shopCart = this.store.shopCart();

		if (!shopCart || !shopCart.id) {
			console.error(
				'Shop cart is null or has no ID. Cannot proceed with payment.',
			);
			return;
		}

		this.paymentStore.createPaymentIntent(shopCart.id);
	}
}
