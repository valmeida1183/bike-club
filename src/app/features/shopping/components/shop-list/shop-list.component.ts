import { Component, input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

import { Bike } from 'src/app/models/bike.model';
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
