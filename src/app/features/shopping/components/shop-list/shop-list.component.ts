import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

import { Bike } from 'src/app/models/bike.model';
import { Purchase } from 'src/app/models/purchase.model';
import { ShopItemComponent } from '../shop-item/shop-item.component';

@Component({
	selector: 'bc-shop-list',
	templateUrl: './shop-list.component.html',
	styleUrls: ['./shop-list.component.scss'],
	standalone: true,
	imports: [CommonModule, ShopItemComponent],
})
export class ShoppListComponent {
	bikes = input<Bike[]>([]);
}
