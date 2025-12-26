import { Component, OnInit, OnDestroy, viewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Role } from 'src/app/models/auth/role.model';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { AuthWebService } from 'src/app/auth/auth-web.service';
import { ShopCart } from 'src/app/models/shopCart.model';
import { BreakpointService } from 'src/app/shared/breakpoint.service';

// Material Imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';

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
	readonly drawer = viewChild<MatSidenav>('drawer');

	shopCart$: Observable<ShopCart>;
	role: Role;
	userName: string;
	cartItemCount: number;

	private readonly componentSubscription = new Subscription();

	constructor(
		public breakpointService: BreakpointService,
		private authWebService: AuthWebService,
		private store: Store<{ shopCart: ShopCart }>,
	) {}

	//#region Life Cicle Events
	ngOnInit(): void {
		this.setAuthenticatedUserInfo();
		this.setShopCartFromStore();
	}

	ngOnDestroy(): void {
		this.componentSubscription.unsubscribe();
	}
	//#endregion

	//#region Events
	onLogout() {
		this.authWebService.logout();
	}
	//#endregion

	//#region Auxiliary
	setAuthenticatedUserInfo(): void {
		const subscription = this.authWebService.authWebUserDataSubject.subscribe(
			(authWebUserData) => {
				if (authWebUserData && authWebUserData.user) {
					const { user } = authWebUserData;

					this.role = user.roleName;
					this.userName = `${user.name} ${user.lastName}`;
				}
			},
		);

		this.componentSubscription.add(subscription);
	}

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
