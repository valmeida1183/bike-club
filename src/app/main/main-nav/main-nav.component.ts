import {
	Component,
	OnInit,
	OnDestroy,
	viewChild,
	inject,
	effect,
	Signal,
	computed,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Role } from 'src/app/models/auth/role.model';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { AuthWebService } from 'src/app/auth/auth-web.service';
import { ShopCart } from 'src/app/models/shopCart.model';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';

// Material Imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthStore } from 'src/app/core/auth/store/auth.store';

@Component({
	selector: 'bc-main-nav',
	templateUrl: './main-nav.component.html',
	styleUrls: ['./main-nav.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		RouterModule,
		MatToolbarModule,
		MatIconModule,
		MatButtonModule,
		MatSidenavModule,
		MatListModule,
		MatBadgeModule,
	],
})
export class MainNavComponent implements OnInit, OnDestroy {
	private authStore = inject(AuthStore);
	readonly drawer = viewChild<MatSidenav>('drawer');

	shopCart$: Observable<ShopCart>;
	cartItemCount: number;

	private readonly componentSubscription = new Subscription();

	constructor(
		protected breakpointService: BreakpointService,
		private store: Store<{ shopCart: ShopCart }>,
	) {
		console.log(`Current user role: ${this.authStore.userRole()}`);
		console.log(`Current user name: ${this.authStore.userFullName()}`);
	}

	//#region Life Cicle Events
	ngOnInit(): void {
		this.setShopCartFromStore();
	}

	ngOnDestroy(): void {
		this.componentSubscription.unsubscribe();
	}
	//#endregion

	//#region Events
	onLogout() {
		this.authStore.logout();
	}
	//#endregion

	//#region Auxiliary
	setShopCartFromStore(): void {
		this.shopCart$ = this.store.select('shopCart');

		const subscription = this.shopCart$.subscribe((storeState) => {
			console.log(storeState);
			this.cartItemCount = storeState.purchases.length;
		});

		this.componentSubscription.add(subscription);
	}
	////#endregion
}
