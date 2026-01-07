import {
	Component,
	computed,
	inject,
	OnDestroy,
	OnInit,
	Signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/models/category.model';
import { Gender } from 'src/app/models/gender.model';
import { TitleComponent } from 'src/app/shared/components/title/title.component';
import { ShoppFilterComponent } from '../components/shop-filter/shop-filter.component';
import { ShoppListComponent } from '../components/shop-list/shop-list.component';
import { BikeSearchFilter } from '../models/bike-search-filter';
import { ShopApiService } from '../services/shop.api.service';
import { ShopStore } from '../store/shop.store';

@Component({
	selector: 'bc-shopping',
	templateUrl: './shopping.component.html',
	styleUrls: ['./shopping.component.scss'],
	standalone: true,
	imports: [TitleComponent, ShoppFilterComponent, ShoppListComponent],
	providers: [ShopStore, ShopApiService],
})
export class ShoppingComponent implements OnInit, OnDestroy {
	private activatedRoute = inject(ActivatedRoute);
	private routeData = toSignal(this.activatedRoute.data);
	protected shopStore = inject(ShopStore);

	protected categories: Signal<Category[]>;
	protected genders: Signal<Gender[]>;
	private bikesSubscription: Subscription;

	ngOnInit(): void {
		this.loadDataFromRouteResolver();
	}

	ngOnDestroy() {
		this.bikesSubscription.unsubscribe();
	}

	onSearch(filter: BikeSearchFilter): void {
		this.shopStore.getBikes(filter);
	}

	private loadDataFromRouteResolver(): void {
		this.categories = computed(() => this.routeData().categories);
		this.genders = computed(() => this.routeData().genders);
	}
}
