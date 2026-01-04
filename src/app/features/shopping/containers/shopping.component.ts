import { Component, OnInit } from '@angular/core';
import { TitleComponent } from 'src/app/shared/components/title/title.component';
import { ShoppFilterComponent } from './shop-filter/shop-filter.component';
import { ShoppListComponent } from './shop-list/shop-list.component';

@Component({
	selector: 'bc-shopping',
	templateUrl: './shopping.component.html',
	styleUrls: ['./shopping.component.scss'],
	standalone: true,
	imports: [TitleComponent, ShoppFilterComponent, ShoppListComponent],
})
export class ShoppingComponent implements OnInit {
	constructor() {}

	ngOnInit() {}
}
