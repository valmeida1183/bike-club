import { CurrencyPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
	selector: 'bc-bike-price-panel',
	imports: [
		CurrencyPipe,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		ReactiveFormsModule,
	],
	templateUrl: './bike-price-panel.component.html',
	styleUrl: './bike-price-panel.component.scss',
})
export class BikePricePanelComponent {
	price = input.required<number>();

	changeAddress = output<void>();
	addToCart = output<number>();
	buyNow = output<number>();

	quantity = new FormControl<number>(1, {
		nonNullable: true,
		validators: [Validators.min(1), Validators.max(20)],
	});

	onChangeAddress(): void {
		this.changeAddress.emit();
	}

	onAddToCart(): void {
		this.addToCart.emit(this.quantity.value);
	}

	onBuyNow(): void {
		this.buyNow.emit(this.quantity.value);
	}
}
