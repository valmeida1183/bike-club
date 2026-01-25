import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'bc-bike-price',
	imports: [CurrencyPipe, MatButtonModule],
	templateUrl: './bike-price.component.html',
	styleUrl: './bike-price.component.scss',
})
export class BikePriceComponent {
	price = input.required<number>();

	onChangeAddress(): void {}
	onAddToCart(): void {}
	onBuyNow(): void {}
}
