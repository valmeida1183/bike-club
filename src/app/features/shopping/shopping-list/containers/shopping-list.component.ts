import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Category } from 'src/app/models/category.model';
import { Gender } from 'src/app/models/gender.model';
import { TitleComponent } from 'src/app/shared/components/title/title.component';
import { ShoppFilterComponent } from '../components/shop-filter/shop-filter.component';
import { ShoppListComponent } from '../components/shop-list/shop-list.component';
import { BikeSearchFilter } from '../models/bike-search-filter';
import { ShoppingListApiService } from '../services/shopping-list.api.service';
import { ShoppingListStore } from '../store/shopping-list.store';

@Component({
	selector: 'bc-shopping',
	templateUrl: './shopping-list.component.html',
	styleUrls: ['./shopping-list.component.scss'],
	standalone: true,
	imports: [TitleComponent, ShoppFilterComponent, ShoppListComponent],
	providers: [ShoppingListStore, ShoppingListApiService],
})
export class ShoppingListComponent implements OnInit {
	private activatedRoute = inject(ActivatedRoute);
	private routeData = toSignal(this.activatedRoute.data);
	protected store = inject(ShoppingListStore);

	protected categories: Signal<Category[]>;
	protected genders: Signal<Gender[]>;

	ngOnInit(): void {
		this.loadDataFromRouteResolver();
	}

	onSearch(filter: BikeSearchFilter): void {
		this.store.getBikes(filter);
	}

	private loadDataFromRouteResolver(): void {
		this.categories = computed(() => this.routeData().categories);
		this.genders = computed(() => this.routeData().genders);
	}
}
