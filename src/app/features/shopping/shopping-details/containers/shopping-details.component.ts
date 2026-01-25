import { Component, inject, input, OnInit } from '@angular/core';
import { TitleComponent } from 'src/app/shared/components/title/title.component';
import { BikeImagePanelComponent } from '../components/bike-image-panel/bike-image-panel.component';
import { ShoppingDetailsApiService } from '../services/shopping-details.api.service';
import { ShoppingDetailsStore } from '../store/shopping-details.store';
import { BikeDescriptionPanelComponent } from '../components/bike-description-panel/bike-description-panel.component';
import { BikePricePanelComponent } from '../components/bike-price-panel/bike-price-panel.component';
import { CartStore } from 'src/app/features/shopping/cart/store/cart.store';

@Component({
	selector: 'bc-shopping-details',
	imports: [
		TitleComponent,
		BikeImagePanelComponent,
		BikeDescriptionPanelComponent,
		BikePricePanelComponent,
	],
	templateUrl: './shopping-details.component.html',
	styleUrl: './shopping-details.component.scss',
	providers: [ShoppingDetailsStore, ShoppingDetailsApiService],
})
export class ShoppingDetailsComponent implements OnInit {
	store = inject(ShoppingDetailsStore);
	cartStore = inject(CartStore);

	id = input.required<number>(); // this id comes from the route due withComponentInputBinding.

	ngOnInit(): void {
		this.store.getBike(this.id());
	}

	onChangeAddress(): void {
		console.log('Change Address clicked');
	}

	onAddToCart(quantity: number): void {
		const bike = this.store.bike();

		if (bike) {
			this.cartStore.addPurchaseToCart(bike, quantity);
		}

		// Todo Redirect to cart page.
	}

	onBuyNow(quantity: number): void {
		console.log('Buy Now clicked with quantity:', quantity);
	}
}
