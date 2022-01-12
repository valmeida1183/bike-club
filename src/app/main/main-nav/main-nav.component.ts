import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { Role } from 'src/app/models/auth/role.model';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthWebService } from 'src/app/auth/auth-web.service';
import { ShopCart } from 'src/app/models/shopCart.model';

@Component({
  selector: 'bc-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent implements OnInit, OnDestroy {
  @ViewChild('drawer') drawer: MatSidenav;
  shopCart$: Observable<ShopCart>;
  role: Role;
  userName: string;
  cartItemCount: number;

  private shopCartSubscription: Subscription;
  private authWebUserDataSubscription: Subscription;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      tap(result => {
        if (!result.matches && this.drawer) {
          this.drawer.close();
        }
      }),
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,
              private authWebService: AuthWebService,
              private store: Store<{shopCart: ShopCart}>) { }

  //#region Life Cicle Events
  ngOnInit(): void {
    this.setAuthenticatedUserInfo();
    this.setShopCartFromStore();
  }

  ngOnDestroy(): void {
    this.authWebUserDataSubscription.unsubscribe();
    this.shopCartSubscription.unsubscribe();
  }
  //#endregion

  //#region Events
  onLogout() {
    this.authWebService.logout();
  }
  //#endregion

  //#region Auxiliary
  setAuthenticatedUserInfo(): void {
    this.authWebUserDataSubscription = this.authWebService.authWebUserDataSubject
      .subscribe(authWebUserData => {
        if (authWebUserData && authWebUserData.user) {
          const { user } = authWebUserData;

          this.role = user.roleName;
          this.userName = `${user.name} ${user.lastName}`;
        }
      });
  }

  setShopCartFromStore(): void {
    this.shopCart$ = this.store.select('shopCart');
    this.shopCartSubscription = this.shopCart$.subscribe(storeState => {
      console.log(storeState);
      this.cartItemCount = storeState.purchases.length;
    });
  }
  ////#endregion
}
