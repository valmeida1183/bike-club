import { Component, inject, input, OnInit } from '@angular/core';
import { TitleComponent } from 'src/app/shared/components/title/title.component';
import { BikeImagePanelComponent } from '../components/bike-image-panel/bike-image-panel.component';
import { ShoppingDetailsApiService } from '../services/shopping-details.api.service';
import { ShoppingDetailsStore } from '../store/shopping-details.store';
import { BikeItemDescriptionComponent } from '../components/bike-item-description/bike-item-description.component';
import { BikePriceComponent } from '../components/bike-price/bike-price.component';

@Component({
	selector: 'bc-shopping-details',
	imports: [
		TitleComponent,
		BikeImagePanelComponent,
		BikeItemDescriptionComponent,
		BikePriceComponent,
	],
	templateUrl: './shopping-details.component.html',
	styleUrl: './shopping-details.component.scss',
	providers: [ShoppingDetailsStore, ShoppingDetailsApiService],
})
export class ShoppingDetailsComponent implements OnInit {
	store = inject(ShoppingDetailsStore);
	id = input.required<number>();

	ngOnInit(): void {
		this.store.getBike(this.id());
	}
}
