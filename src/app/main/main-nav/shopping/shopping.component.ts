import { Component, OnInit } from '@angular/core';
import { TitleComponent } from 'src/app/shared/components/title/title.component';
import { ShoppFilterComponent } from './shopp-filter/shopp-filter.component';
import { ShoppListComponent } from './shopp-list/shopp-list.component';

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
