// import { CommonModule } from '@angular/common';
// import { Component, inject, OnDestroy, OnInit, viewChild } from '@angular/core';
// import { RouterModule } from '@angular/router';
// import { Store } from '@ngrx/store';
// import { Observable, Subscription } from 'rxjs';

// import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
// import { ShopCart } from 'src/app/models/shopCart.model';
// import { BreakpointService } from 'src/app/shared/services/breakpoint.service';

// // Material Imports
// import { MatBadgeModule } from '@angular/material/badge';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatListModule } from '@angular/material/list';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { AuthStore } from 'src/app/core/auth/store/auth.store';

// @Component({
// 	selector: 'bc-main-nav',
// 	templateUrl: './main-nav.component.html',
// 	styleUrls: ['./main-nav.component.scss'],
// 	standalone: true,
// 	imports: [
// 		CommonModule,
// 		RouterModule,
// 		MatToolbarModule,
// 		MatIconModule,
// 		MatButtonModule,
// 		MatSidenavModule,
// 		MatListModule,
// 		MatBadgeModule,
// 	],
// })
// export class MainNavComponent implements OnInit, OnDestroy {
// 	private authStore = inject(AuthStore);
// 	readonly drawer = viewChild<MatSidenav>('drawer');

// 	shopCart$: Observable<ShopCart>;
// 	cartItemCount: number;

// 	private readonly componentSubscription = new Subscription();

// 	constructor(
// 		protected breakpointService: BreakpointService,
// 		private store: Store<{ shopCart: ShopCart }>,
// 	) {
// 		console.log(`Current user role: ${this.authStore.userRole()}`);
// 		console.log(`Current user name: ${this.authStore.userFullName()}`);
// 	}

// 	//#region Life Cicle Events
// 	ngOnInit(): void {
// 		this.setShopCartFromStore();
// 	}

// 	ngOnDestroy(): void {
// 		this.componentSubscription.unsubscribe();
// 	}
// 	//#endregion

// 	//#region Events
// 	onLogout() {
// 		this.authStore.logout();
// 	}
// 	//#endregion

// 	//#region Auxiliary
// 	setShopCartFromStore(): void {
// 		this.shopCart$ = this.store.select('shopCart');

// 		const subscription = this.shopCart$.subscribe((storeState) => {
// 			console.log(storeState);
// 			this.cartItemCount = storeState.purchases.length;
// 		});

// 		this.componentSubscription.add(subscription);
// 	}
// 	////#endregion
// }
