import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { TitleComponent } from 'src/app/shared/components/title/title.component';
import { ShoppFilterComponent } from '../components/shop-filter/shop-filter.component';
import { ShoppListComponent } from './shop-list/shop-list.component';
import { ActivatedRoute } from '@angular/router';
import { Category } from 'src/app/models/category.model';
import { Gender } from 'src/app/models/gender.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { BikeSearchFilter } from '../models/bike-search-filter';
import { loadBikes } from 'src/app/store/actions/shopping-list.actions';
import { Store } from '@ngrx/store';

@Component({
	selector: 'bc-shopping',
	templateUrl: './shopping.component.html',
	styleUrls: ['./shopping.component.scss'],
	standalone: true,
	imports: [TitleComponent, ShoppFilterComponent, ShoppListComponent],
})
export class ShoppingComponent implements OnInit {
	private activatedRoute = inject(ActivatedRoute);
	private routeData = toSignal(this.activatedRoute.data);

	protected categories: Signal<Category[]>;
	protected genders: Signal<Gender[]>;

	constructor(private store: Store<{ shoppingList: any }>) {}

	ngOnInit(): void {
		this.loadDataFromRouteResolver();
	}

	onSearch(filter: BikeSearchFilter): void {
		this.store.dispatch(loadBikes({ query: filter }));
	}

	private loadDataFromRouteResolver(): void {
		this.categories = computed(() => this.routeData().categories);
		this.genders = computed(() => this.routeData().genders);
	}
}
